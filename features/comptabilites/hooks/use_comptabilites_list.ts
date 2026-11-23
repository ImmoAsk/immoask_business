"use client";

import { useState } from "react";
import { daysBetween } from "@/lib/utils/dates";
import type {
  ComptabiliteAdvancedFilters,
  ComptabiliteFilters,
  ComptabiliteOperation,
  ComptabiliteSort,
} from "../types";
import { COMPTABILITE_CATEGORIES } from "./comptabilites_categories";

export const DEFAULT_COMPTABILITE_FILTERS: ComptabiliteFilters = { flow: "tous", category: "tous", period: "mois" };
export const DEFAULT_COMPTABILITE_ADVANCED: ComptabiliteAdvancedFilters = {
  status: "tous",
  bien: "tous",
  minAmount: null,
  maxAmount: null,
};
export const COMPTABILITE_PAGE_SIZES = [10, 20, 50] as const;

/** Lowercase, accent-free text. */
function normalize(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function matchesQuery(operation: ComptabiliteOperation, query: string) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const text = normalize(
    [
      operation.reference,
      operation.description,
      operation.bien,
      operation.counterparty ?? "",
      COMPTABILITE_CATEGORIES[operation.category].label,
      String(operation.amount),
    ].join(" "),
  );
  return terms.every((term) => text.includes(term));
}

function matchesFilters(operation: ComptabiliteOperation, filters: ComptabiliteFilters, asOf: string) {
  if (filters.flow !== "tous" && operation.flow !== filters.flow) return false;
  if (filters.category !== "tous" && operation.category !== filters.category) return false;
  const age = daysBetween(operation.date, asOf);
  if (filters.period === "7_jours" && age >= 7) return false;
  if (filters.period === "15_jours" && age >= 15) return false;
  return true;
}

function matchesAdvanced(operation: ComptabiliteOperation, advanced: ComptabiliteAdvancedFilters) {
  if (advanced.status !== "tous" && operation.status !== advanced.status) return false;
  if (advanced.bien !== "tous" && operation.bien !== advanced.bien) return false;
  if (advanced.minAmount !== null && operation.amount < advanced.minAmount) return false;
  if (advanced.maxAmount !== null && operation.amount > advanced.maxAmount) return false;
  return true;
}

export function countAdvancedFilters(advanced: ComptabiliteAdvancedFilters) {
  return (Object.keys(advanced) as (keyof ComptabiliteAdvancedFilters)[]).filter(
    (key) => advanced[key] !== DEFAULT_COMPTABILITE_ADVANCED[key],
  ).length;
}

function compare(a: ComptabiliteOperation, b: ComptabiliteOperation, sort: ComptabiliteSort) {
  const order = sort.key === "date" ? a.date.localeCompare(b.date) || a.reference.localeCompare(b.reference) : a.amount - b.amount;
  return sort.direction === "asc" ? order : -order;
}

/** Search, filters, advanced filters, sorting and pagination. Any filter change returns to page 1. */
export function useComptabilitesList(operations: ComptabiliteOperation[], asOf: string) {
  const [query, setQueryState] = useState("");
  const [filters, setFiltersState] = useState<ComptabiliteFilters>(DEFAULT_COMPTABILITE_FILTERS);
  const [advanced, setAdvancedState] = useState<ComptabiliteAdvancedFilters>(DEFAULT_COMPTABILITE_ADVANCED);
  const [sort, setSortState] = useState<ComptabiliteSort>({ key: "date", direction: "desc" });
  const [pageSize, setPageSizeState] = useState<number>(COMPTABILITE_PAGE_SIZES[0]);
  const [page, setPageState] = useState(1);

  const results = operations
    .filter(
      (operation) =>
        matchesQuery(operation, query) && matchesFilters(operation, filters, asOf) && matchesAdvanced(operation, advanced),
    )
    .sort((a, b) => compare(a, b, sort));
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
    filters,
    setFilters: (value: ComptabiliteFilters) => {
      // A category from the other flow would match nothing: drop it.
      const category =
        value.category !== "tous" && value.flow !== "tous" && COMPTABILITE_CATEGORIES[value.category].flow !== value.flow
          ? "tous"
          : value.category;
      setFiltersState({ ...value, category });
      resetPage();
    },
    advanced,
    setAdvanced: (value: ComptabiliteAdvancedFilters) => {
      setAdvancedState(value);
      resetPage();
    },
    advancedCount: countAdvancedFilters(advanced),
    resetAll: () => {
      setQueryState("");
      setFiltersState(DEFAULT_COMPTABILITE_FILTERS);
      setAdvancedState(DEFAULT_COMPTABILITE_ADVANCED);
      resetPage();
    },
    biens: [...new Set(operations.map((operation) => operation.bien))].filter((bien) => bien !== "—").sort((a, b) => a.localeCompare(b, "fr")),
    sort,
    /** Click on a sortable header: same key flips the direction, a new key starts descending. */
    toggleSort: (key: ComptabiliteSort["key"]) =>
      setSortState((previous) =>
        previous.key === key ? { key, direction: previous.direction === "asc" ? "desc" : "asc" } : { key, direction: "desc" },
      ),
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

export type UseComptabilitesListResult = ReturnType<typeof useComptabilitesList>;
