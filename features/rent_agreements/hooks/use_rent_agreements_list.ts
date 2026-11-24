"use client";

import { useState } from "react";
import type { RentAgreement, RentAgreementFilters, RentAgreementOption, RentAgreementTab } from "../types";
import { agreementStatus } from "./rent_agreements_status";

export const DEFAULT_RENT_AGREEMENT_FILTERS: RentAgreementFilters = { type: "tous", management: "tous", tenant: "tous", deposit: "tous" };

const TABS: { value: RentAgreementTab; label: string }[] = [
  { value: "tous", label: "Tous" },
  { value: "actif", label: "Actifs" },
  { value: "a_venir", label: "À venir" },
  { value: "termine", label: "Terminés" },
  { value: "resilie", label: "Résiliés" },
];

/** Lowercase, accent-free text. */
function normalize(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function matchesFilters(agreement: RentAgreement, filters: RentAgreementFilters) {
  if (filters.type !== "tous" && agreement.type !== filters.type) return false;
  if (filters.management !== "tous" && agreement.management.reference !== filters.management) return false;
  if (filters.tenant !== "tous" && agreement.tenant !== filters.tenant) return false;
  if (filters.deposit !== "tous" && agreement.deposit.mode !== filters.deposit) return false;
  return true;
}

const uniqueSorted = (values: string[]): RentAgreementOption[] =>
  [...new Set(values)].sort((a, b) => a.localeCompare(b, "fr")).map((value) => ({ value, label: value }));

/** Search, status tabs and filters. */
export function useRentAgreementsList(agreements: RentAgreement[], asOf: string) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<RentAgreementTab>("tous");
  const [filters, setFilters] = useState<RentAgreementFilters>(DEFAULT_RENT_AGREEMENT_FILTERS);

  const terms = normalize(query).split(/\s+/).filter(Boolean);
  // Tab counts follow the search and filters, so each tab says what clicking it shows.
  const base = agreements.filter((agreement) => {
    const text = normalize(`${agreement.reference} ${agreement.tenant} ${agreement.property} ${agreement.management.reference}`);
    return terms.every((term) => text.includes(term)) && matchesFilters(agreement, filters);
  });
  const results = base.filter((agreement) => tab === "tous" || agreementStatus(agreement, asOf) === tab);

  return {
    query,
    setQuery,
    tab,
    setTab,
    tabs: TABS.map((option) => ({
      ...option,
      count: base.filter((agreement) => option.value === "tous" || agreementStatus(agreement, asOf) === option.value).length,
    })),
    filters,
    setFilters,
    activeFilterCount: (Object.keys(filters) as (keyof RentAgreementFilters)[]).filter(
      (key) => filters[key] !== DEFAULT_RENT_AGREEMENT_FILTERS[key],
    ).length,
    resetFilters: () => setFilters(DEFAULT_RENT_AGREEMENT_FILTERS),
    managementRefs: uniqueSorted(agreements.map((agreement) => agreement.management.reference)),
    tenants: uniqueSorted(agreements.map((agreement) => agreement.tenant)),
    results,
  };
}

export type UseRentAgreementsListResult = ReturnType<typeof useRentAgreementsList>;
