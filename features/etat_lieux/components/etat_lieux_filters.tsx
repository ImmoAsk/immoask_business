import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import type { UseEtatLieuxListResult } from "../hooks/use_etat_lieux_list";
import type { InventoryFilters, InventoryOption } from "../types";
import { etatLieuxControl, fieldLabel } from "./etat_lieux_styles";

const TYPES: InventoryOption<InventoryFilters["type"]>[] = [
  { value: "tous", label: "Type" },
  { value: "entree", label: "Entrée" },
  { value: "sortie", label: "Sortie" },
];

const COST_CHIPS: InventoryOption<InventoryFilters["cost"]>[] = [
  { value: "tous", label: "Tous" },
  { value: "avec", label: "Avec coût" },
  { value: "sans", label: "Sans coût" },
];

export type EtatLieuxFiltersProps = {
  list: UseEtatLieuxListResult;
  open: boolean;
  onToggle: () => void;
};

/** Search, three dropdowns, the extra filters panel and the status tabs. */
export function EtatLieuxFilters({ list, open, onToggle }: EtatLieuxFiltersProps) {
  const { filters, setFilters } = list;

  return (
    <section aria-label="Recherche et filtres" className="flex flex-col gap-3.5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <form role="search" onSubmit={(event) => event.preventDefault()} className="relative min-w-0 flex-1">
          <label htmlFor="etat-lieux-search" className="sr-only">
            Rechercher un élément
          </label>
          <Icon name="search" className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-zinc-400" />
          <input
            id="etat-lieux-search"
            type="search"
            value={list.query}
            onChange={(event) => list.setQuery(event.target.value)}
            placeholder="Rechercher un élément, une propriété, un locataire…"
            className={cn(etatLieuxControl, focusRing, "w-full pr-4 pl-12 placeholder:text-zinc-400")}
          />
        </form>
        <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
          <Select
            id="etat-lieux-filter-type"
            label="Type d'inventaire"
            value={filters.type}
            options={TYPES}
            onChange={(type) => setFilters({ ...filters, type: type as InventoryFilters["type"] })}
          />
          <Select
            id="etat-lieux-filter-property"
            label="Propriété"
            value={filters.property}
            options={[{ value: "tous", label: "Propriété" }, ...list.properties]}
            onChange={(property) => setFilters({ ...filters, property })}
          />
          <Select
            id="etat-lieux-filter-manager"
            label="Gestionnaire"
            value={filters.manager}
            options={[{ value: "tous", label: "Gestionnaire" }, ...list.managers]}
            onChange={(manager) => setFilters({ ...filters, manager })}
          />
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls="etat-lieux-more-filters"
            aria-label={list.activeFilterCount > 0 ? `Plus de filtres (${list.activeFilterCount} actif${list.activeFilterCount > 1 ? "s" : ""})` : "Plus de filtres"}
            className={cn(
              etatLieuxControl,
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
          id="etat-lieux-more-filters"
          className="flex flex-wrap items-center gap-x-9 gap-y-3.5 rounded-2xl border border-zinc-200 bg-white px-5 py-4 dark:border-white/10 dark:bg-zinc-950"
        >
          <div className="flex flex-col gap-2">
            <span id="etat-lieux-cost-label" className={fieldLabel}>
              Coût de l&apos;élément
            </span>
            <div role="group" aria-labelledby="etat-lieux-cost-label" className="flex flex-wrap gap-1.5">
              {COST_CHIPS.map((chip) => {
                const active = filters.cost === chip.value;
                return (
                  <button
                    key={chip.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilters({ ...filters, cost: chip.value })}
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

      <div role="group" aria-label="Filtrer par état" className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1">
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
  options: InventoryOption[];
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
          etatLieuxControl,
          focusRing,
          "w-full cursor-pointer appearance-none truncate pr-10 pl-4 font-semibold sm:w-48",
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
