"use client";

import { useState } from "react";
import type { Versement, VersementFilters, VersementTab } from "../types";
import { ageDays, TYPE_LABELS } from "./versements_labels";

export const DEFAULT_VERSEMENT_FILTERS: VersementFilters = { method: "tous", period: "tous", currency: "tous" };

const TABS: { value: VersementTab; label: string }[] = [
  { value: "tous", label: "Tous" },
  { value: "loyer", label: "Loyers" },
  { value: "caution", label: "Cautions" },
  { value: "service", label: "Services" },
];

/** Lowercase, accent-free text. */
function normalize(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function matchesFilters(versement: Versement, filters: VersementFilters, asOf: string) {
  if (filters.method !== "tous" && versement.method !== filters.method) return false;
  if (filters.currency !== "tous" && versement.currency !== filters.currency) return false;
  if (filters.period !== "tous" && ageDays(versement.date, asOf) > Number(filters.period)) return false;
  return true;
}

/** Search, deposit type tabs and filters. Most recent deposit first. */
export function useVersementsList(versements: Versement[], asOf: string) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<VersementTab>("tous");
  const [filters, setFilters] = useState<VersementFilters>(DEFAULT_VERSEMENT_FILTERS);

  const terms = normalize(query).split(/\s+/).filter(Boolean);
  // Tab counts follow the search and filters, so each tab says what clicking it shows.
  const base = versements.filter((versement) => {
    const { reference, owner, manager, property } = versement.management;
    const text = normalize(
      `${versement.reference} ${reference} ${owner} ${manager} ${property} ${versement.transactionRef} ${TYPE_LABELS[versement.type]}`,
    );
    return terms.every((term) => text.includes(term)) && matchesFilters(versement, filters, asOf);
  });
  const results = base
    .filter((versement) => tab === "tous" || versement.type === tab)
    .sort((a, b) => b.date.localeCompare(a.date) || b.reference.localeCompare(a.reference));

  return {
    query,
    setQuery,
    tab,
    setTab,
    tabs: TABS.map((option) => ({ ...option, count: base.filter((versement) => option.value === "tous" || versement.type === option.value).length })),
    filters,
    setFilters,
    activeFilterCount: (Object.keys(filters) as (keyof VersementFilters)[]).filter((key) => filters[key] !== DEFAULT_VERSEMENT_FILTERS[key]).length,
    resetFilters: () => setFilters(DEFAULT_VERSEMENT_FILTERS),
    results,
  };
}

export type UseVersementsListResult = ReturnType<typeof useVersementsList>;
