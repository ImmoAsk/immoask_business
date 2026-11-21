"use client";

import { useState } from "react";
import type { Proprietaire, ProprietaireFilters, ProprietaireOption, ProprietaireQuickFilter } from "../types";
import { isMandateEndingSoon } from "./proprietaires_dates";

export const DEFAULT_PROPRIETAIRE_FILTERS: ProprietaireFilters = { reversement: "tous", mandate: "tous", commune: "tous" };

export const PROPRIETAIRE_PAGE_SIZES = [7, 14, 28] as const;

/** Lowercase, accent-free text. */
function normalize(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function matchesQuery(proprietaire: Proprietaire, query: string) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  // A query made only of digits and phone symbols ("+33 6 12") is one number.
  const queryDigits = query.replace(/\D/g, "");
  if (/^[\d\s+().-]+$/.test(query.trim()) && queryDigits.length >= 2) {
    return proprietaire.phone.replace(/\D/g, "").includes(queryDigits);
  }
  const text = normalize(
    [
      proprietaire.name,
      proprietaire.residence,
      ...proprietaire.biens.flatMap((bien) => [bien.title, bien.reference, bien.quartier, bien.city]),
    ].join(" "),
  );
  const digits = proprietaire.phone.replace(/\D/g, "");
  return terms.every((term) => {
    const termDigits = term.replace(/\D/g, "");
    // "90 45" or "+33 6" match the phone; letters match the text.
    if (termDigits.length >= 2 && termDigits.length === term.replace(/[\s+().-]/g, "").length) {
      return digits.includes(termDigits);
    }
    return text.includes(term);
  });
}

export function matchesQuickFilter(proprietaire: Proprietaire, quick: ProprietaireQuickFilter, asOf: string) {
  switch (quick) {
    case "tous":
      return true;
    case "actifs":
      return proprietaire.status === "actif";
    case "a_reverser":
      return proprietaire.reversement.status === "en_attente";
    case "diaspora":
      return proprietaire.profile === "diaspora";
    case "mandat_simple":
      return proprietaire.mandate.type === "simple";
    case "fin_mandat":
      return isMandateEndingSoon(proprietaire.mandate.endDate, asOf);
  }
}

function matchesFilters(proprietaire: Proprietaire, filters: ProprietaireFilters) {
  if (filters.reversement !== "tous" && proprietaire.reversement.status !== filters.reversement) return false;
  if (filters.mandate !== "tous" && proprietaire.mandate.type !== filters.mandate) return false;
  if (filters.commune !== "tous" && !proprietaire.biens.some((bien) => bien.city === filters.commune)) return false;
  return true;
}

export function countActiveFilters(filters: ProprietaireFilters) {
  return (Object.keys(filters) as (keyof ProprietaireFilters)[]).filter(
    (key) => filters[key] !== DEFAULT_PROPRIETAIRE_FILTERS[key],
  ).length;
}

/** Communes where the owners have properties, with how many owners each. */
export function communeOptions(proprietaires: Proprietaire[]): ProprietaireOption[] {
  const counts = new Map<string, number>();
  for (const proprietaire of proprietaires) {
    for (const city of new Set(proprietaire.biens.map((bien) => bien.city))) {
      counts.set(city, (counts.get(city) ?? 0) + 1);
    }
  }
  return [...counts]
    .map(([value, count]) => ({ value, label: value, count }))
    .sort((a, b) => a.label.localeCompare(b.label, "fr"));
}

const QUICK_FILTERS: { value: ProprietaireQuickFilter; label: string }[] = [
  { value: "tous", label: "Tous" },
  { value: "actifs", label: "Actifs" },
  { value: "a_reverser", label: "À reverser" },
  { value: "diaspora", label: "Diaspora" },
  { value: "mandat_simple", label: "Mandat simple" },
  { value: "fin_mandat", label: "Fin de mandat proche" },
];

/** Search, quick filter chips, dropdown filters and pagination. Any change returns to page 1. */
export function useProprietairesList(proprietaires: Proprietaire[], asOf: string) {
  const [query, setQueryState] = useState("");
  const [quick, setQuickState] = useState<ProprietaireQuickFilter>("tous");
  const [filters, setFiltersState] = useState<ProprietaireFilters>(DEFAULT_PROPRIETAIRE_FILTERS);
  const [pageSize, setPageSizeState] = useState<number>(PROPRIETAIRE_PAGE_SIZES[0]);
  const [page, setPageState] = useState(1);

  // Chip counts follow the search and dropdowns, so each chip says what clicking it shows.
  const base = proprietaires.filter(
    (proprietaire) => matchesQuery(proprietaire, query) && matchesFilters(proprietaire, filters),
  );
  const results = base.filter((proprietaire) => matchesQuickFilter(proprietaire, quick, asOf));
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
    setQuick: (value: ProprietaireQuickFilter) => {
      setQuickState(value);
      resetPage();
    },
    quickOptions: QUICK_FILTERS.map((option) => ({
      ...option,
      count: base.filter((proprietaire) => matchesQuickFilter(proprietaire, option.value, asOf)).length,
    })),
    filters,
    setFilters: (value: ProprietaireFilters) => {
      setFiltersState(value);
      resetPage();
    },
    resetFilters: () => {
      setFiltersState(DEFAULT_PROPRIETAIRE_FILTERS);
      setQuickState("tous");
      setQueryState("");
      resetPage();
    },
    activeFilterCount: countActiveFilters(filters) + (quick === "tous" ? 0 : 1) + (query.trim() ? 1 : 0),
    communeOptions: communeOptions(proprietaires),
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

export type UseProprietairesListResult = ReturnType<typeof useProprietairesList>;
