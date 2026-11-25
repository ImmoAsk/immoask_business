import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import type { UseVersementsListResult } from "../hooks/use_versements_list";
import type { VersementFilters, VersementOption } from "../types";
import { fieldLabel, versementsControl } from "./versements_styles";

const METHODS: VersementOption<VersementFilters["method"]>[] = [
  { value: "tous", label: "Moyen de versement" },
  { value: "virement", label: "Virement" },
  { value: "mobile_money", label: "Mobile Money" },
];

const CURRENCY_CHIPS: VersementOption<VersementFilters["currency"]>[] = [
  { value: "tous", label: "Toutes" },
  { value: "FCFA", label: "FCFA" },
  { value: "EUR", label: "EUR" },
  { value: "USD", label: "USD" },
];

const PERIODS: VersementOption<VersementFilters["period"]>[] = [
  { value: "tous", label: "Date du dépôt" },
  { value: "7", label: "7 derniers jours" },
  { value: "30", label: "30 derniers jours" },
];

export type VersementsFiltersProps = {
  list: UseVersementsListResult;
  open: boolean;
  onToggle: () => void;
};

/** Search, three dropdowns, the extra filters panel and the status tabs. */
export function VersementsFilters({ list, open, onToggle }: VersementsFiltersProps) {
  const { filters, setFilters } = list;

  return (
    <section aria-label="Recherche et filtres" className="flex flex-col gap-3.5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <form role="search" onSubmit={(event) => event.preventDefault()} className="relative min-w-0 flex-1">
          <label htmlFor="versements-search" className="sr-only">
            Rechercher un versement
          </label>
          <Icon name="search" className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-zinc-400" />
          <input
            id="versements-search"
            type="search"
            value={list.query}
            onChange={(event) => list.setQuery(event.target.value)}
            placeholder="Rechercher par contrat, propriétaire, référence…"
            className={cn(versementsControl, focusRing, "w-full pr-4 pl-12 placeholder:text-zinc-400")}
          />
        </form>
        <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
          <Select
            id="versements-filter-method"
            label="Moyen de versement"
            value={filters.method}
            options={METHODS}
            onChange={(method) => setFilters({ ...filters, method: method as VersementFilters["method"] })}
          />
          <Select
            id="versements-filter-period"
            label="Date du dépôt"
            value={filters.period}
            options={PERIODS}
            onChange={(period) => setFilters({ ...filters, period: period as VersementFilters["period"] })}
          />
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls="versements-more-filters"
            aria-label={list.activeFilterCount > 0 ? `Plus de filtres (${list.activeFilterCount} actif${list.activeFilterCount > 1 ? "s" : ""})` : "Plus de filtres"}
            className={cn(
              versementsControl,
              focusRing,
              "relative grid w-full cursor-pointer place-items-center sm:w-12",
              open && "border-brand-400 bg-brand-50 dark:border-brand-500/60 dark:bg-brand-900/30",
            )}
          >
            <Icon name="sliders" className="size-5 text-brand-700 dark:text-brand-100" />
            {list.activeFilterCount > 0 ? (
              <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
                {list.activeFilterCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="versements-more-filters"
          className="flex flex-wrap items-center gap-x-9 gap-y-3.5 rounded-2xl border border-zinc-200 bg-white px-5 py-4 dark:border-white/10 dark:bg-zinc-950"
        >
          <div className="flex flex-col gap-2">
            <span id="versements-currency-label" className={fieldLabel}>
              Devise
            </span>
            <div role="group" aria-labelledby="versements-currency-label" className="flex flex-wrap gap-1.5">
              {CURRENCY_CHIPS.map((chip) => {
                const active = filters.currency === chip.value;
                return (
                  <button
                    key={chip.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilters({ ...filters, currency: chip.value })}
                    className={cn(
                      "h-9 cursor-pointer rounded-full border px-3.5 text-[13px] font-semibold transition-colors",
                      focusRing,
                      active
                        ? "border-brand-600 bg-brand-50 text-brand-800 dark:border-brand-400 dark:bg-brand-900/40 dark:text-brand-100"
                        : "border-zinc-300 text-zinc-700 hover:border-zinc-400 dark:border-white/15 dark:text-zinc-200",
                    )}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>
          <button
            type="button"
            onClick={list.resetFilters}
            className={cn("ml-auto h-9 cursor-pointer rounded-lg px-2 text-[13.5px] font-bold text-brand-700 hover:underline dark:text-brand-100", focusRing)}
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : null}

      <div role="group" aria-label="Filtrer par type de dépôt" className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1">
        {list.tabs.map((tab) => {
          const active = list.tab === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              aria-pressed={active}
              onClick={() => list.setTab(tab.value)}
              className={cn(
                "inline-flex h-11 shrink-0 cursor-pointer items-center gap-2.5 rounded-full px-5 text-sm font-semibold whitespace-nowrap transition-colors",
                focusRing,
                active
                  ? "bg-brand-600 text-white shadow-sm dark:bg-brand-500"
                  : "bg-white text-zinc-800 ring-1 ring-zinc-200 hover:bg-zinc-50 dark:bg-zinc-950 dark:text-zinc-200 dark:ring-white/10 dark:hover:bg-white/5",
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "grid h-6 min-w-6 place-items-center rounded-full px-2 text-xs font-bold tabular-nums",
                  active ? "bg-white/20" : "bg-zinc-100 dark:bg-white/10",
                )}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Select({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: VersementOption[];
  onChange: (value: string) => void;
}) {
  const active = value !== "tous";
  return (
    <div className="relative min-w-0">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          versementsControl,
          focusRing,
          "w-full cursor-pointer appearance-none truncate pr-10 pl-4 font-semibold sm:w-52",
          active && "border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-500/60 dark:bg-brand-900/30 dark:text-brand-100",
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon name="chevronDown" className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-zinc-500" />
    </div>
  );
}
