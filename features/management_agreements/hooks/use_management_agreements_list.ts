"use client";

import { useState } from "react";
import type {
  ManagementAgreement,
  ManagementAgreementFilters,
  ManagementAgreementOption,
  ManagementAgreementTab,
} from "../types";

export const DEFAULT_MANAGEMENT_FILTERS: ManagementAgreementFilters = { mode: "tous", manager: "tous", owner: "tous", biens: "tous" };

const TABS: { value: ManagementAgreementTab; label: string }[] = [
  { value: "tous", label: "Tous" },
  { value: "actif", label: "Actifs" },
  { value: "en_attente", label: "En attente" },
  { value: "resilie", label: "Résiliés" },
];

/** Lowercase, accent-free text. */
function normalize(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function matchesFilters(agreement: ManagementAgreement, filters: ManagementAgreementFilters) {
  if (filters.mode !== "tous" && agreement.remuneration.mode !== filters.mode) return false;
  if (filters.manager !== "tous" && agreement.manager !== filters.manager) return false;
  if (filters.owner !== "tous" && agreement.owner.name !== filters.owner) return false;
  if (filters.biens === "avec" && agreement.biensCount === 0) return false;
  if (filters.biens === "sans" && agreement.biensCount > 0) return false;
  return true;
}

const uniqueSorted = (values: string[]): ManagementAgreementOption[] =>
  [...new Set(values)].sort((a, b) => a.localeCompare(b, "fr")).map((value) => ({ value, label: value }));

/** Search, status tabs and filters. */
export function useManagementAgreementsList(agreements: ManagementAgreement[]) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<ManagementAgreementTab>("tous");
  const [filters, setFilters] = useState<ManagementAgreementFilters>(DEFAULT_MANAGEMENT_FILTERS);

  const terms = normalize(query).split(/\s+/).filter(Boolean);
  // Tab counts follow the search and filters, so each tab says what clicking it shows.
  const base = agreements.filter((agreement) => {
    const text = normalize(`${agreement.reference} ${agreement.owner.name} ${agreement.manager} ${agreement.building}`);
    return terms.every((term) => text.includes(term)) && matchesFilters(agreement, filters);
  });
  const results = base.filter((agreement) => tab === "tous" || agreement.status === tab);

  return {
    query,
    setQuery,
    tab,
    setTab,
    tabs: TABS.map((option) => ({
      ...option,
      count: base.filter((agreement) => option.value === "tous" || agreement.status === option.value).length,
    })),
    filters,
    setFilters,
    /** Filters set besides search and tab (badge on the filters button). */
    activeFilterCount: (Object.keys(filters) as (keyof ManagementAgreementFilters)[]).filter(
      (key) => filters[key] !== DEFAULT_MANAGEMENT_FILTERS[key],
    ).length,
    resetFilters: () => setFilters(DEFAULT_MANAGEMENT_FILTERS),
    managers: uniqueSorted(agreements.map((agreement) => agreement.manager)),
    owners: uniqueSorted(agreements.map((agreement) => agreement.owner.name)),
    results,
  };
}

export type UseManagementAgreementsListResult = ReturnType<typeof useManagementAgreementsList>;
