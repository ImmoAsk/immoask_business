"use client";

import { useState } from "react";
import type { InventoryFilters, InventoryLine, InventoryOption, InventoryTab } from "../types";
import { KIND_LABELS } from "./etat_lieux_items";

export const DEFAULT_INVENTORY_FILTERS: InventoryFilters = { type: "tous", property: "tous", manager: "tous", cost: "tous" };

const TABS: { value: InventoryTab; label: string }[] = [
  { value: "tous", label: "Tous" },
  { value: "excellent", label: "Excellent" },
  { value: "bon", label: "Bon" },
  { value: "moyen", label: "Moyen" },
  { value: "endommage", label: "Endommagé" },
];

/** Lowercase, accent-free text. */
function normalize(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function matchesFilters(line: InventoryLine, filters: InventoryFilters) {
  if (filters.type !== "tous" && line.inventory.type !== filters.type) return false;
  if (filters.property !== "tous" && line.inventory.property !== filters.property) return false;
  if (filters.manager !== "tous" && line.inventory.manager !== filters.manager) return false;
  if (filters.cost === "avec" && line.cost === null) return false;
  if (filters.cost === "sans" && line.cost !== null) return false;
  return true;
}

const uniqueSorted = (values: string[]): InventoryOption[] =>
  [...new Set(values)].sort((a, b) => a.localeCompare(b, "fr")).map((value) => ({ value, label: value }));

/** Search, condition tabs and filters over the inventoried items (already sorted, most recent first). */
export function useEtatLieuxList(lines: InventoryLine[]) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<InventoryTab>("tous");
  const [filters, setFilters] = useState<InventoryFilters>(DEFAULT_INVENTORY_FILTERS);

  const terms = normalize(query).split(/\s+/).filter(Boolean);
  // Tab counts follow the search and filters, so each tab says what clicking it shows.
  const base = lines.filter((line) => {
    const { reference, property, tenant } = line.inventory;
    const text = normalize(`${reference} ${line.element} ${line.room} ${property} ${tenant} ${KIND_LABELS[line.kind]}`);
    return terms.every((term) => text.includes(term)) && matchesFilters(line, filters);
  });

  return {
    query,
    setQuery,
    tab,
    setTab,
    tabs: TABS.map((option) => ({
      ...option,
      count: base.filter((line) => option.value === "tous" || line.condition === option.value).length,
    })),
    filters,
    setFilters,
    activeFilterCount: (Object.keys(filters) as (keyof InventoryFilters)[]).filter((key) => filters[key] !== DEFAULT_INVENTORY_FILTERS[key]).length,
    resetFilters: () => setFilters(DEFAULT_INVENTORY_FILTERS),
    /** "Voir l'inventaire complet": every item of one inventory. */
    showInventory: (reference: string) => {
      setQuery(reference);
      setTab("tous");
    },
    properties: uniqueSorted(lines.map((line) => line.inventory.property)),
    managers: uniqueSorted(lines.map((line) => line.inventory.manager)),
    results: base.filter((line) => tab === "tous" || line.condition === tab),
  };
}

export type UseEtatLieuxListResult = ReturnType<typeof useEtatLieuxList>;
