"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { Select } from "@/components/ui/select";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { countActiveFilters, DEFAULT_PORTOFOLIO_FILTERS } from "../hooks/use_portofolio_list";
import type {
  PortofolioFilters,
  PortofolioOption,
  PortofolioPriceRange,
  PortofolioSort,
  PortofolioView,
} from "../types";
import { portofolioControl, portofolioPanel, portofolioStatuses, portofolioTypes } from "./portofolios_styles";

const typeOptions: PortofolioOption<PortofolioFilters["type"]>[] = [
  { value: "tous", label: "Tous" },
  ...Object.entries(portofolioTypes).map(([value, type]) => ({
    value: value as PortofolioFilters["type"],
    label: type.label,
  })),
];

const statusOptions: PortofolioOption<PortofolioFilters["status"]>[] = [
  { value: "tous", label: "Tous" },
  ...Object.entries(portofolioStatuses).map(([value, status]) => ({
    value: value as PortofolioFilters["status"],
    label: status.label,
  })),
];

const priceOptions: PortofolioOption<PortofolioPriceRange>[] = [
  { value: "toutes", label: "Toutes" },
  { value: "moins_100k", label: "Moins de 100 000 FCFA" },
  { value: "100k_300k", label: "100 000 – 300 000 FCFA" },
  { value: "300k_700k", label: "300 000 – 700 000 FCFA" },
  { value: "plus_700k", label: "Plus de 700 000 FCFA" },
];

const sortOptions: PortofolioOption<PortofolioSort>[] = [
  { value: "pertinence", label: "Pertinence" },
  { value: "loyer_desc", label: "Loyer décroissant" },
  { value: "loyer_asc", label: "Loyer croissant" },
  { value: "titre", label: "Nom (A → Z)" },
];

const views: { value: PortofolioView; label: string; icon: "dashboard" | "mapPin" }[] = [
  { value: "tableau", label: "Tableau", icon: "dashboard" },
  { value: "carte", label: "Carte", icon: "mapPin" },
];

export type PortofoliosAdvancedSearchProps = {
  query: string;
  onQueryChange: (query: string) => void;
  filters: PortofolioFilters;
  onFiltersChange: (filters: PortofolioFilters) => void;
  cityOptions: PortofolioOption[];
  sort: PortofolioSort;
  onSortChange: (sort: PortofolioSort) => void;
  view: PortofolioView;
  onViewChange: (view: PortofolioView) => void;
};

/** Search bar, sort, view switch and the "Filtres avancés" panel (applied on "Appliquer"). */
export function PortofoliosAdvancedSearch({
  query,
  onQueryChange,
  filters,
  onFiltersChange,
  cityOptions,
  sort,
  onSortChange,
  view,
  onViewChange,
}: PortofoliosAdvancedSearchProps) {
  const [open, setOpen] = useState(false);
  const activeCount = countActiveFilters(filters);

  return (
    <section aria-label="Recherche et filtres" className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <form role="search" onSubmit={(event) => event.preventDefault()} className="relative min-w-0 flex-1">
          <label htmlFor="portofolio-search" className="sr-only">
            Rechercher un bien
          </label>
          <Icon
            name="search"
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-zinc-400"
          />
          <input
            id="portofolio-search"
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Rechercher un bien, une localisation, un propriétaire…"
            className={cn(portofolioControl, focusRing, "w-full pr-4 pl-12 placeholder:text-zinc-400")}
          />
        </form>

        <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
          <button
            type="button"
            aria-expanded={open}
            aria-controls="portofolio-filters"
            onClick={() => setOpen((value) => !value)}
            className={cn(
              portofolioControl,
              focusRing,
              "inline-flex cursor-pointer items-center justify-center gap-2 px-4 font-medium",
              open && "border-brand-300 text-brand-700 dark:border-brand-500/60 dark:text-brand-100",
            )}
          >
            <Icon name="filter" className="size-4.5" />
            Filtres<span className="-ml-1 hidden sm:inline"> avancés</span>
            {activeCount > 0 ? (
              <span className="grid size-5 place-items-center rounded-full bg-brand-600 text-[11px] font-semibold text-white">
                {activeCount}
              </span>
            ) : null}
            <Icon name="chevronDown" className={cn("size-4 transition-transform", open && "rotate-180")} />
          </button>

          <div className="relative min-w-0">
            <label htmlFor="portofolio-sort" className="sr-only">
              Trier par
            </label>
            <Icon name="sort" className="pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-zinc-500" />
            <select
              id="portofolio-sort"
              value={sort}
              onChange={(event) => onSortChange(event.target.value as PortofolioSort)}
              className={cn(portofolioControl, focusRing, "w-full cursor-pointer appearance-none pr-10 pl-11 font-medium")}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.value === "pertinence" ? "Trier par" : option.label}
                </option>
              ))}
            </select>
            <Icon name="chevronDown" className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-zinc-500" />
          </div>

          <div
            role="group"
            aria-label="Affichage"
            className="col-span-2 inline-flex h-12 rounded-2xl border border-zinc-200 bg-white p-1 dark:border-white/10 dark:bg-zinc-950"
          >
            {views.map((item) => {
              const active = view === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onViewChange(item.value)}
                  className={cn(
                    "inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors sm:flex-none",
                    focusRing,
                    active
                      ? "bg-brand-600 text-white dark:bg-brand-500"
                      : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white",
                  )}
                >
                  <Icon name={item.icon} className="size-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {open ? (
        <FilterPanel
          filters={filters}
          cityOptions={cityOptions}
          onApply={(next) => {
            onFiltersChange(next);
            setOpen(false);
          }}
          onReset={() => onFiltersChange(DEFAULT_PORTOFOLIO_FILTERS)}
        />
      ) : null}
    </section>
  );
}

/** Mounted on open, so the draft always starts from the applied filters. */
function FilterPanel({
  filters,
  cityOptions,
  onApply,
  onReset,
}: {
  filters: PortofolioFilters;
  cityOptions: PortofolioOption[];
  onApply: (filters: PortofolioFilters) => void;
  onReset: () => void;
}) {
  const [draft, setDraft] = useState(filters);
  const draftCount = countActiveFilters(draft);

  function field<K extends keyof PortofolioFilters>(key: K, label: string, options: PortofolioOption[]) {
    const id = `portofolio-filter-${key}`;
    return (
      <div className="flex min-w-0 flex-col gap-1.5">
        <label htmlFor={id} className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
          {label}
        </label>
        <Select
          id={id}
          value={draft[key]}
          onChange={(event) => setDraft({ ...draft, [key]: event.target.value })}
          className="h-11 rounded-xl"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
    );
  }

  return (
    <form
      id="portofolio-filters"
      onSubmit={(event) => {
        event.preventDefault();
        onApply(draft);
      }}
      className={cn(portofolioPanel, "grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_auto]")}
    >
      {field("type", "Type de bien", typeOptions)}
      {field("city", "Localisation", cityOptions)}
      {field("status", "Statut", statusOptions)}
      {field("price", "Fourchette de prix", priceOptions)}
      <div className="flex items-end justify-end gap-2 sm:col-span-2 xl:col-span-1">
        <button
          type="button"
          onClick={() => {
            setDraft(DEFAULT_PORTOFOLIO_FILTERS);
            onReset();
          }}
          className={cn(
            "inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl px-3 text-sm font-semibold text-brand-700 hover:bg-brand-50 dark:text-brand-100 dark:hover:bg-white/5",
            focusRing,
          )}
        >
          <Icon name="reset" className="size-4" />
          Réinitialiser
        </button>
        <button
          type="submit"
          className={cn(
            "inline-flex h-11 cursor-pointer items-center rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600",
            focusRing,
          )}
        >
          Appliquer{draftCount > 0 ? ` (${draftCount})` : ""}
        </button>
      </div>
    </form>
  );
}
