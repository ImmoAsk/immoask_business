"use client";

import { useState } from "react";
import { phoneDigits } from "@/lib/utils/phone";
import type { RentCollection, RentCollectionFilters, RentCollectionOption, RentCollectionQuickFilter } from "../types";
import { hasLine, isPending, isReceived, natureLabel } from "./rent_collections_money";

export const DEFAULT_RENT_COLLECTION_FILTERS: RentCollectionFilters = { nature: "tous", channel: "tous", tenant: "tous" };

export const RENT_COLLECTION_PAGE_SIZES = [7, 14, 28] as const;

/** Lowercase, accent-free text. */
function normalize(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function matchesQuery(collection: RentCollection, query: string) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  // A query made only of digits and phone symbols ("+228 90 12") is one phone number.
  const queryDigits = query.replace(/\D/g, "");
  if (/^[\d\s+().-]+$/.test(query.trim()) && queryDigits.length >= 2 && !/^\d{1,3}$/.test(query.trim())) {
    return phoneDigits(collection.tenant.phone).includes(queryDigits) || collection.reference.endsWith(queryDigits);
  }
  const text = normalize(
    [
      `#${collection.reference}`,
      collection.tenant.name,
      collection.bien.title,
      collection.bien.quartier,
      collection.bien.city,
      natureLabel(collection),
      collection.channelLabel,
      collection.transactionRef ?? "",
    ].join(" "),
  );
  return terms.every((term) => text.includes(term));
}

export function matchesQuickFilter(collection: RentCollection, quick: RentCollectionQuickFilter) {
  const serviceOrDeposit = hasLine(collection, "caution") || hasLine(collection, "service");
  switch (quick) {
    case "tous":
      return true;
    case "loyers_regles":
      return isReceived(collection) && hasLine(collection, "loyer") && !serviceOrDeposit;
    case "en_attente":
      return isPending(collection);
    case "services_cautions":
      return serviceOrDeposit;
    case "mobile_money":
      return collection.channel === "mobile_money";
  }
}

function matchesFilters(collection: RentCollection, filters: RentCollectionFilters) {
  if (filters.nature !== "tous" && !hasLine(collection, filters.nature)) return false;
  if (filters.channel !== "tous" && collection.channel !== filters.channel) return false;
  if (filters.tenant !== "tous" && collection.tenant.name !== filters.tenant) return false;
  return true;
}

export function countActiveFilters(filters: RentCollectionFilters) {
  return (Object.keys(filters) as (keyof RentCollectionFilters)[]).filter(
    (key) => filters[key] !== DEFAULT_RENT_COLLECTION_FILTERS[key],
  ).length;
}

export function tenantOptions(collections: RentCollection[]): RentCollectionOption[] {
  const counts = new Map<string, number>();
  for (const collection of collections) counts.set(collection.tenant.name, (counts.get(collection.tenant.name) ?? 0) + 1);
  return [...counts]
    .map(([value, count]) => ({ value, label: value, count }))
    .sort((a, b) => a.label.localeCompare(b.label, "fr"));
}

const QUICK_FILTERS: { value: RentCollectionQuickFilter; label: string }[] = [
  { value: "tous", label: "Tous" },
  { value: "loyers_regles", label: "Loyers réglés" },
  { value: "en_attente", label: "En attente" },
  { value: "services_cautions", label: "Services et cautions" },
  { value: "mobile_money", label: "Mobile Money" },
];

/** Search, quick filter chips, dropdown filters and pagination. Any change returns to page 1. Newest first. */
export function useRentCollectionsList(collections: RentCollection[]) {
  const [query, setQueryState] = useState("");
  const [quick, setQuickState] = useState<RentCollectionQuickFilter>("tous");
  const [filters, setFiltersState] = useState<RentCollectionFilters>(DEFAULT_RENT_COLLECTION_FILTERS);
  const [pageSize, setPageSizeState] = useState<number>(RENT_COLLECTION_PAGE_SIZES[0]);
  const [page, setPageState] = useState(1);

  const sorted = [...collections].sort((a, b) => b.reference.localeCompare(a.reference));
  // Chip counts follow the search and dropdowns, so each chip says what clicking it shows.
  const base = sorted.filter((collection) => matchesQuery(collection, query) && matchesFilters(collection, filters));
  const results = base.filter((collection) => matchesQuickFilter(collection, quick));
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
    setQuick: (value: RentCollectionQuickFilter) => {
      setQuickState(value);
      resetPage();
    },
    quickOptions: QUICK_FILTERS.map((option) => ({
      ...option,
      count: base.filter((collection) => matchesQuickFilter(collection, option.value)).length,
    })),
    filters,
    setFilters: (value: RentCollectionFilters) => {
      setFiltersState(value);
      resetPage();
    },
    resetFilters: () => {
      setFiltersState(DEFAULT_RENT_COLLECTION_FILTERS);
      setQuickState("tous");
      setQueryState("");
      resetPage();
    },
    activeFilterCount: countActiveFilters(filters) + (quick === "tous" ? 0 : 1) + (query.trim() ? 1 : 0),
    tenantOptions: tenantOptions(collections),
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

export type UseRentCollectionsListResult = ReturnType<typeof useRentCollectionsList>;
