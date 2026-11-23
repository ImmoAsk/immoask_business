"use client";

import { useState } from "react";
import { phoneDigits } from "@/lib/utils/phone";
import type { RentPayment, RentPaymentFilters, RentPaymentOption, RentPaymentQuickFilter } from "../types";
import { paymentStatus } from "./rent_payments_status";

export const DEFAULT_RENT_PAYMENT_FILTERS: RentPaymentFilters = { method: "tous", tenant: "tous" };

export const RENT_PAYMENT_PAGE_SIZES = [7, 14, 28] as const;

/** Lowercase, accent-free text. */
function normalize(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function matchesQuery(payment: RentPayment, query: string) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  // A query made only of digits and phone symbols ("+228 90 12") is one phone number.
  const queryDigits = query.replace(/\D/g, "");
  if (/^[\d\s+().-]+$/.test(query.trim()) && queryDigits.length >= 4) {
    return phoneDigits(payment.tenant.phone).includes(queryDigits);
  }
  const text = normalize(
    [
      `#${payment.reference}`,
      payment.tenant.name,
      payment.bien.title,
      payment.bien.quartier,
      payment.bien.city,
      payment.bien.lot ? `lot ${payment.bien.lot}` : "",
      payment.settlement?.label ?? "",
    ].join(" "),
  );
  return terms.every((term) => text.includes(term));
}

export function matchesQuickFilter(payment: RentPayment, quick: RentPaymentQuickFilter, asOf: string) {
  return quick === "tous" || paymentStatus(payment, asOf) === quick;
}

function matchesFilters(payment: RentPayment, filters: RentPaymentFilters) {
  if (filters.method !== "tous") {
    const method = payment.settlement?.method ?? "attente";
    if (method !== filters.method) return false;
  }
  if (filters.tenant !== "tous" && payment.tenant.name !== filters.tenant) return false;
  return true;
}

export function countActiveFilters(filters: RentPaymentFilters) {
  return (Object.keys(filters) as (keyof RentPaymentFilters)[]).filter(
    (key) => filters[key] !== DEFAULT_RENT_PAYMENT_FILTERS[key],
  ).length;
}

export function tenantOptions(payments: RentPayment[]): RentPaymentOption[] {
  return [...new Set(payments.map((payment) => payment.tenant.name))]
    .sort((a, b) => a.localeCompare(b, "fr"))
    .map((name) => ({ value: name, label: name }));
}

const QUICK_FILTERS: { value: RentPaymentQuickFilter; label: string }[] = [
  { value: "tous", label: "Tous les loyers" },
  { value: "paye", label: "Complètement payés" },
  { value: "partiel", label: "Partiellement payés" },
  { value: "a_payer", label: "À payer / en attente" },
  { value: "en_retard", label: "En retard" },
];

/** Search, status chips, dropdown filters and pagination. Any change returns to page 1. Newest first. */
export function useRentPaymentsList(payments: RentPayment[], asOf: string) {
  const [query, setQueryState] = useState("");
  const [quick, setQuickState] = useState<RentPaymentQuickFilter>("tous");
  const [filters, setFiltersState] = useState<RentPaymentFilters>(DEFAULT_RENT_PAYMENT_FILTERS);
  const [pageSize, setPageSizeState] = useState<number>(RENT_PAYMENT_PAGE_SIZES[0]);
  const [page, setPageState] = useState(1);

  const sorted = [...payments].sort((a, b) => b.reference.localeCompare(a.reference));
  // Chip counts follow the search and dropdowns, so each chip says what clicking it shows.
  const base = sorted.filter((payment) => matchesQuery(payment, query) && matchesFilters(payment, filters));
  const results = base.filter((payment) => matchesQuickFilter(payment, quick, asOf));
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
    setQuick: (value: RentPaymentQuickFilter) => {
      setQuickState(value);
      resetPage();
    },
    quickOptions: QUICK_FILTERS.map((option) => ({
      ...option,
      count: base.filter((payment) => matchesQuickFilter(payment, option.value, asOf)).length,
    })),
    filters,
    setFilters: (value: RentPaymentFilters) => {
      setFiltersState(value);
      resetPage();
    },
    resetFilters: () => {
      setFiltersState(DEFAULT_RENT_PAYMENT_FILTERS);
      setQuickState("tous");
      setQueryState("");
      resetPage();
    },
    activeFilterCount: countActiveFilters(filters) + (quick === "tous" ? 0 : 1) + (query.trim() ? 1 : 0),
    tenantOptions: tenantOptions(payments),
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

export type UseRentPaymentsListResult = ReturnType<typeof useRentPaymentsList>;
