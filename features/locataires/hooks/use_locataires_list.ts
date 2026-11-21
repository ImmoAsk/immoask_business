"use client";

import { useState } from "react";
import type { Locataire, LocataireFilters, LocataireOption, LocataireQuickFilter } from "../types";
import { isLeaseEndingSoon } from "./locataires_dates";

export const DEFAULT_LOCATAIRE_FILTERS: LocataireFilters = { payment: "tous", lease: "tous", area: "tous" };

export const LOCATAIRE_PAGE_SIZES = [5, 10, 20] as const;

/** Lowercase, accent-free text; digits only for phone numbers. */
function normalize(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

export function areaKey(locataire: Locataire) {
  return `${locataire.bien.city}|${locataire.bien.quartier}`;
}

function matchesQuery(locataire: Locataire, query: string) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  // A query made only of digits and phone symbols ("+33 6 12") is one number.
  const queryDigits = query.replace(/\D/g, "");
  if (/^[\d\s+().-]+$/.test(query.trim()) && queryDigits.length >= 2) {
    return locataire.phone.replace(/\D/g, "").includes(queryDigits);
  }
  const text = normalize(
    [
      locataire.name,
      locataire.occupation,
      locataire.bien.title,
      locataire.bien.reference,
      locataire.bien.quartier,
      locataire.bien.city,
    ].join(" "),
  );
  const digits = locataire.phone.replace(/\D/g, "");
  return terms.every((term) => {
    const termDigits = term.replace(/\D/g, "");
    // "90 12" or "+228 90" match the phone; letters match the text.
    if (termDigits.length >= 2 && termDigits.length === term.replace(/[\s+().-]/g, "").length) {
      return digits.includes(termDigits);
    }
    return text.includes(term);
  });
}

export function matchesQuickFilter(locataire: Locataire, quick: LocataireQuickFilter, asOf: string) {
  switch (quick) {
    case "tous":
      return true;
    case "a_jour":
      return locataire.payment.status === "a_jour";
    case "en_retard":
      return locataire.payment.status === "en_retard";
    case "fin_bail":
      return isLeaseEndingSoon(locataire.lease.endDate, asOf);
    case "commerciaux":
      return locataire.lease.type === "commercial";
  }
}

function matchesFilters(locataire: Locataire, filters: LocataireFilters) {
  if (filters.payment !== "tous" && locataire.payment.status !== filters.payment) return false;
  if (filters.lease !== "tous" && locataire.lease.type !== filters.lease) return false;
  if (filters.area !== "tous" && areaKey(locataire) !== filters.area) return false;
  return true;
}

export function countActiveFilters(filters: LocataireFilters) {
  return (Object.keys(filters) as (keyof LocataireFilters)[]).filter(
    (key) => filters[key] !== DEFAULT_LOCATAIRE_FILTERS[key],
  ).length;
}

export function areaOptions(locataires: Locataire[]): LocataireOption[] {
  const areas = new Map<string, string>();
  for (const locataire of locataires) {
    areas.set(areaKey(locataire), `${locataire.bien.quartier} (${locataire.bien.city})`);
  }
  return [
    { value: "tous", label: "Toutes les communes" },
    ...[...areas].map(([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label, "fr")),
  ];
}

const QUICK_FILTERS: { value: LocataireQuickFilter; label: string }[] = [
  { value: "tous", label: "Tous" },
  { value: "a_jour", label: "À jour" },
  { value: "en_retard", label: "En retard" },
  { value: "fin_bail", label: "Fin de bail proche" },
  { value: "commerciaux", label: "Commerciaux" },
];

/** Search, quick filter chips, dropdown filters and pagination. Any change returns to page 1. */
export function useLocatairesList(locataires: Locataire[], asOf: string) {
  const [query, setQueryState] = useState("");
  const [quick, setQuickState] = useState<LocataireQuickFilter>("tous");
  const [filters, setFiltersState] = useState<LocataireFilters>(DEFAULT_LOCATAIRE_FILTERS);
  const [pageSize, setPageSizeState] = useState<number>(10);
  const [page, setPageState] = useState(1);

  // Chip counts follow the search and dropdowns, so each chip says what clicking it shows.
  const base = locataires.filter((locataire) => matchesQuery(locataire, query) && matchesFilters(locataire, filters));
  const results = base.filter((locataire) => matchesQuickFilter(locataire, quick, asOf));
  const pageCount = Math.max(1, Math.ceil(results.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;

  const resetPage = () => setPageState(1);

  return {
    query,
    setQuery: (value: string) => {
      setQueryState(value);
      resetPage();
    },
    quick,
    setQuick: (value: LocataireQuickFilter) => {
      setQuickState(value);
      resetPage();
    },
    quickOptions: QUICK_FILTERS.map((option) => ({
      ...option,
      count: base.filter((locataire) => matchesQuickFilter(locataire, option.value, asOf)).length,
    })),
    filters,
    setFilters: (value: LocataireFilters) => {
      setFiltersState(value);
      resetPage();
    },
    resetFilters: () => {
      setFiltersState(DEFAULT_LOCATAIRE_FILTERS);
      setQuickState("tous");
      setQueryState("");
      resetPage();
    },
    activeFilterCount: countActiveFilters(filters) + (quick === "tous" ? 0 : 1) + (query.trim() ? 1 : 0),
    areaOptions: areaOptions(locataires),
    page: currentPage,
    setPage: (value: number) => setPageState(Math.min(Math.max(1, value), pageCount)),
    pageSize,
    setPageSize: (value: number) => {
      setPageSizeState(value);
      resetPage();
    },
    pageCount,
    results,
    pageItems: results.slice(start, start + pageSize),
    range: { from: results.length === 0 ? 0 : start + 1, to: Math.min(start + pageSize, results.length) },
  };
}

export type UseLocatairesListResult = ReturnType<typeof useLocatairesList>;
