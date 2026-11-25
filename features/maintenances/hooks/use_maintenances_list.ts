"use client";

import { useState } from "react";
import type { Maintenance, MaintenanceCategory, MaintenanceFilters, MaintenanceOption, MaintenanceTab } from "../types";
import { ageDays, CATEGORY_LABELS, isStale } from "./maintenances_age";

export const DEFAULT_MAINTENANCE_FILTERS: MaintenanceFilters = { category: "tous", property: "tous", period: "tous", staleOnly: false };

const TABS: { value: MaintenanceTab; label: string }[] = [
  { value: "toutes", label: "Toutes" },
  { value: "nouvelle", label: "Nouvelles" },
  { value: "en_traitement", label: "En traitement" },
  { value: "resolue", label: "Résolues" },
];

/** Lowercase, accent-free text. */
function normalize(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function matchesFilters(maintenance: Maintenance, filters: MaintenanceFilters, asOf: string) {
  if (filters.category !== "tous" && maintenance.category !== filters.category) return false;
  if (filters.property !== "tous" && maintenance.property !== filters.property) return false;
  if (filters.period !== "tous" && ageDays(maintenance, asOf) > Number(filters.period)) return false;
  if (filters.staleOnly && !isStale(maintenance, asOf)) return false;
  return true;
}

/** Search, status tabs and filters. Most recent request first. */
export function useMaintenancesList(maintenances: Maintenance[], asOf: string) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<MaintenanceTab>("toutes");
  const [filters, setFilters] = useState<MaintenanceFilters>(DEFAULT_MAINTENANCE_FILTERS);

  const terms = normalize(query).split(/\s+/).filter(Boolean);
  // Tab counts follow the search and filters, so each tab says what clicking it shows.
  const base = maintenances.filter((maintenance) => {
    const text = normalize(
      `${maintenance.reference} ${maintenance.description} ${CATEGORY_LABELS[maintenance.category]} ${maintenance.property}`,
    );
    return terms.every((term) => text.includes(term)) && matchesFilters(maintenance, filters, asOf);
  });
  const results = base
    .filter((maintenance) => tab === "toutes" || maintenance.status === tab)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.reference.localeCompare(a.reference));

  const usedCategories = new Set(maintenances.map((maintenance) => maintenance.category));
  const categories: MaintenanceOption<MaintenanceCategory>[] = (Object.keys(CATEGORY_LABELS) as MaintenanceCategory[])
    .filter((category) => usedCategories.has(category))
    .map((value) => ({ value, label: CATEGORY_LABELS[value] }))
    .sort((a, b) => a.label.localeCompare(b.label, "fr"));

  return {
    query,
    setQuery,
    tab,
    setTab,
    tabs: TABS.map((option) => ({
      ...option,
      count: base.filter((maintenance) => option.value === "toutes" || maintenance.status === option.value).length,
    })),
    filters,
    setFilters,
    activeFilterCount: (Object.keys(filters) as (keyof MaintenanceFilters)[]).filter(
      (key) => filters[key] !== DEFAULT_MAINTENANCE_FILTERS[key],
    ).length,
    resetFilters: () => setFilters(DEFAULT_MAINTENANCE_FILTERS),
    /** "Voir les plus anciennes": every tab, only stale requests. */
    showStale: () => {
      setTab("toutes");
      setFilters((previous) => ({ ...previous, staleOnly: true }));
    },
    categories,
    properties: [...new Set(maintenances.map((maintenance) => maintenance.property))]
      .sort((a, b) => a.localeCompare(b, "fr"))
      .map((value): MaintenanceOption => ({ value, label: value })),
    results,
  };
}

export type UseMaintenancesListResult = ReturnType<typeof useMaintenancesList>;
