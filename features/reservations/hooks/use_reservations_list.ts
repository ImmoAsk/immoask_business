"use client";

import { useState } from "react";
import type { Reservation, ReservationFilters, ReservationOption, ReservationTab } from "../types";

export const DEFAULT_RESERVATION_FILTERS: ReservationFilters = { property: "tous", owner: "tous", manager: "tous", pickup: "tous" };

const TABS: { value: ReservationTab; label: string }[] = [
  { value: "toutes", label: "Toutes" },
  { value: "nouvelle", label: "Nouvelles" },
  { value: "en_cours", label: "En cours" },
  { value: "effectuee", label: "Effectuées" },
];

/** Lowercase, accent-free text. */
function normalize(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function matchesFilters(reservation: Reservation, filters: ReservationFilters) {
  if (filters.property !== "tous" && reservation.property !== filters.property) return false;
  if (filters.owner !== "tous" && reservation.owner !== filters.owner) return false;
  if (filters.manager !== "tous" && reservation.manager !== filters.manager) return false;
  if (filters.pickup !== "tous" && reservation.pickup !== filters.pickup) return false;
  return true;
}

const uniqueSorted = (values: string[]): ReservationOption[] =>
  [...new Set(values)].sort((a, b) => a.localeCompare(b, "fr")).map((value) => ({ value, label: value }));

/** Search, status tabs and filters. Most recent arrival first. */
export function useReservationsList(reservations: Reservation[]) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<ReservationTab>("toutes");
  const [filters, setFilters] = useState<ReservationFilters>(DEFAULT_RESERVATION_FILTERS);

  const terms = normalize(query).split(/\s+/).filter(Boolean);
  // Tab counts follow the search and filters, so each tab says what clicking it shows.
  const base = reservations.filter((reservation) => {
    const text = normalize(`${reservation.reference} ${reservation.tenant.name} ${reservation.property} ${reservation.owner}`);
    return terms.every((term) => text.includes(term)) && matchesFilters(reservation, filters);
  });
  const results = base
    .filter((reservation) => tab === "toutes" || reservation.status === tab)
    .sort((a, b) => b.arrival.localeCompare(a.arrival));

  return {
    query,
    setQuery,
    tab,
    setTab,
    tabs: TABS.map((option) => ({
      ...option,
      count: base.filter((reservation) => option.value === "toutes" || reservation.status === option.value).length,
    })),
    filters,
    setFilters,
    activeFilterCount: (Object.keys(filters) as (keyof ReservationFilters)[]).filter(
      (key) => filters[key] !== DEFAULT_RESERVATION_FILTERS[key],
    ).length,
    resetFilters: () => setFilters(DEFAULT_RESERVATION_FILTERS),
    properties: uniqueSorted(reservations.map((reservation) => reservation.property)),
    owners: uniqueSorted(reservations.map((reservation) => reservation.owner)),
    managers: uniqueSorted(reservations.map((reservation) => reservation.manager)),
    pickups: uniqueSorted(reservations.map((reservation) => reservation.pickup)),
    results,
  };
}

export type UseReservationsListResult = ReturnType<typeof useReservationsList>;
