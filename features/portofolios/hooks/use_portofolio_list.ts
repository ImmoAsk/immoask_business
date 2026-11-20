"use client";

import { useState } from "react";
import type {
  PortofolioBien,
  PortofolioFilters,
  PortofolioOption,
  PortofolioPriceRange,
  PortofolioSort,
} from "../types";

export const DEFAULT_PORTOFOLIO_FILTERS: PortofolioFilters = {
  type: "tous",
  city: "toutes",
  status: "tous",
  price: "toutes",
};

export const PORTOFOLIO_PAGE_SIZES = [5, 10, 20] as const;

const priceBounds: Record<PortofolioPriceRange, [number, number]> = {
  toutes: [0, Infinity],
  moins_100k: [0, 100_000],
  "100k_300k": [100_000, 300_000],
  "300k_700k": [300_000, 700_000],
  plus_700k: [700_000, Infinity],
};

/** Lowercase, accent-free text for search ("Agoè" matches "agoe"). */
function normalize(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function searchText(bien: PortofolioBien) {
  const occupant =
    bien.occupant.kind === "locataire" ? bien.occupant.name : "label" in bien.occupant ? bien.occupant.label : "";
  return normalize(
    [
      bien.title,
      bien.reference,
      bien.location.quartier,
      bien.location.city,
      bien.location.zone,
      bien.ownerName,
      occupant,
    ].join(" "),
  );
}

/** "Vacant" also matches let buildings that still have free units, like the availability KPI. */
function matchesStatus(bien: PortofolioBien, status: PortofolioBien["status"]) {
  if (status === "vacant") {
    return bien.status === "vacant" || (bien.status === "loue" && bien.units.occupied < bien.units.total);
  }
  return bien.status === status;
}

export function filterPortofolio(biens: PortofolioBien[], query: string, filters: PortofolioFilters) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  const [min, max] = priceBounds[filters.price];

  return biens.filter((bien) => {
    if (filters.type !== "tous" && bien.type !== filters.type) return false;
    if (filters.city !== "toutes" && bien.location.city !== filters.city) return false;
    if (filters.status !== "tous" && !matchesStatus(bien, filters.status)) return false;
    if (bien.rent < min || bien.rent >= max) return false;
    if (terms.length === 0) return true;
    const text = searchText(bien);
    return terms.every((term) => text.includes(term));
  });
}

export function sortPortofolio(biens: PortofolioBien[], sort: PortofolioSort) {
  switch (sort) {
    case "loyer_desc":
      return biens.toSorted((a, b) => b.rent - a.rent);
    case "loyer_asc":
      return biens.toSorted((a, b) => a.rent - b.rent);
    case "titre":
      return biens.toSorted((a, b) => a.title.localeCompare(b.title, "fr"));
    case "pertinence":
      return biens;
  }
}

/** Number of filters that differ from the defaults. */
export function countActiveFilters(filters: PortofolioFilters) {
  return (Object.keys(filters) as (keyof PortofolioFilters)[]).filter(
    (key) => filters[key] !== DEFAULT_PORTOFOLIO_FILTERS[key],
  ).length;
}

export function cityOptions(biens: PortofolioBien[]): PortofolioOption[] {
  const cities = [...new Set(biens.map((bien) => bien.location.city))].sort((a, b) => a.localeCompare(b, "fr"));
  return [{ value: "toutes", label: "Toutes les villes" }, ...cities.map((city) => ({ value: city, label: city }))];
}

/** Search, filters, sort and pagination over the portfolio. Any change returns to page 1. */
export function usePortofolioList(biens: PortofolioBien[]) {
  const [query, setQueryState] = useState("");
  const [filters, setFiltersState] = useState<PortofolioFilters>(DEFAULT_PORTOFOLIO_FILTERS);
  const [sort, setSortState] = useState<PortofolioSort>("pertinence");
  const [pageSize, setPageSizeState] = useState<number>(10);
  const [page, setPageState] = useState(1);

  const results = sortPortofolio(filterPortofolio(biens, query, filters), sort);
  const pageCount = Math.max(1, Math.ceil(results.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;

  return {
    query,
    setQuery: (value: string) => {
      setQueryState(value);
      setPageState(1);
    },
    filters,
    setFilters: (value: PortofolioFilters) => {
      setFiltersState(value);
      setPageState(1);
    },
    resetFilters: () => {
      setFiltersState(DEFAULT_PORTOFOLIO_FILTERS);
      setPageState(1);
    },
    activeFilterCount: countActiveFilters(filters),
    sort,
    setSort: (value: PortofolioSort) => {
      setSortState(value);
      setPageState(1);
    },
    page: currentPage,
    setPage: (value: number) => setPageState(Math.min(Math.max(1, value), pageCount)),
    pageSize,
    setPageSize: (value: number) => {
      setPageSizeState(value);
      setPageState(1);
    },
    pageCount,
    results,
    pageItems: results.slice(start, start + pageSize),
    range: { from: results.length === 0 ? 0 : start + 1, to: Math.min(start + pageSize, results.length) },
    cityOptions: cityOptions(biens),
  };
}

export type UsePortofolioListResult = ReturnType<typeof usePortofolioList>;
