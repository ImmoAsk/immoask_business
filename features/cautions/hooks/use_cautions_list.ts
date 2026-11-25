"use client";

import { useState } from "react";
import type { Caution, CautionFilters, CautionOption, CautionTab } from "../types";
import { cautionStatus, depositAge, LOW_LEVEL_PERCENT, remainingPercent } from "./cautions_balance";

export const DEFAULT_CAUTION_FILTERS: CautionFilters = { property: "tous", mode: "tous", period: "tous", lowOnly: false };

const TABS: { value: CautionTab; label: string }[] = [
  { value: "toutes", label: "Toutes" },
  { value: "intacte", label: "Intactes" },
  { value: "modifiee", label: "Modifiées" },
];

/** Lowercase, accent-free text. */
function normalize(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function matchesFilters(caution: Caution, filters: CautionFilters, asOf: string) {
  if (filters.property !== "tous" && caution.agreement.property !== filters.property) return false;
  if (filters.mode !== "tous" && caution.mode !== filters.mode) return false;
  if (filters.period !== "tous" && depositAge(caution, asOf) > Number(filters.period)) return false;
  if (filters.lowOnly && remainingPercent(caution) >= LOW_LEVEL_PERCENT) return false;
  return true;
}

/** Search, status tabs and filters. Most recent deposit first. */
export function useCautionsList(cautions: Caution[], asOf: string) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<CautionTab>("toutes");
  const [filters, setFilters] = useState<CautionFilters>(DEFAULT_CAUTION_FILTERS);

  const terms = normalize(query).split(/\s+/).filter(Boolean);
  // Tab counts follow the search and filters, so each tab says what clicking it shows.
  const base = cautions.filter((caution) => {
    const text = normalize(`${caution.reference} ${caution.agreement.reference} ${caution.agreement.tenant} ${caution.agreement.property}`);
    return terms.every((term) => text.includes(term)) && matchesFilters(caution, filters, asOf);
  });
  const results = base
    .filter((caution) => tab === "toutes" || cautionStatus(caution) === tab)
    .sort((a, b) => b.depositedAt.localeCompare(a.depositedAt));

  return {
    query,
    setQuery,
    tab,
    setTab,
    tabs: TABS.map((option) => ({ ...option, count: base.filter((caution) => option.value === "toutes" || cautionStatus(caution) === option.value).length })),
    filters,
    setFilters,
    activeFilterCount: (Object.keys(filters) as (keyof CautionFilters)[]).filter((key) => filters[key] !== DEFAULT_CAUTION_FILTERS[key]).length,
    resetFilters: () => setFilters(DEFAULT_CAUTION_FILTERS),
    properties: [...new Set(cautions.map((caution) => caution.agreement.property))]
      .sort((a, b) => a.localeCompare(b, "fr"))
      .map((value): CautionOption => ({ value, label: value })),
    results,
  };
}

export type UseCautionsListResult = ReturnType<typeof useCautionsList>;
