import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import type { ProprietaireFilters, ProprietaireOption, ProprietaireQuickFilter, ProprietaireView } from "../types";
import { proprietairesControl } from "./proprietaires_styles";

const reversementOptions: ProprietaireOption<ProprietaireFilters["reversement"]>[] = [
  { value: "tous", label: "Reversement" },
  { value: "a_jour", label: "À jour" },
  { value: "en_attente", label: "En attente" },
  { value: "planifie", label: "Planifié" },
];

const mandateOptions: ProprietaireOption<ProprietaireFilters["mandate"]>[] = [
  { value: "tous", label: "Type de mandat" },
  { value: "exclusif", label: "Exclusif" },
  { value: "simple", label: "Simple" },
];

export type ProprietairesFiltersProps = {
  filters: ProprietaireFilters;
  onFiltersChange: (filters: ProprietaireFilters) => void;
  communeOptions: ProprietaireOption[];
  /** Number of active criteria (search, chip, dropdowns); enables the reset button. */
  activeCount: number;
  onReset: () => void;
  className?: string;
};

/** The three dropdowns and the reset button. */
export function ProprietairesFilters({
  filters,
  onFiltersChange,
  communeOptions,
  activeCount,
  onReset,
  className,
}: ProprietairesFiltersProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center", className)}>
      <FilterSelect
        id="proprietaires-filter-reversement"
        label="Reversement"
        value={filters.reversement}
        options={reversementOptions}
        onChange={(reversement) =>
          onFiltersChange({ ...filters, reversement: reversement as ProprietaireFilters["reversement"] })
        }
      />
      <FilterSelect
        id="proprietaires-filter-mandate"
        label="Type de mandat"
        value={filters.mandate}
        options={mandateOptions}
        onChange={(mandate) => onFiltersChange({ ...filters, mandate: mandate as ProprietaireFilters["mandate"] })}
      />
      <FilterSelect
        id="proprietaires-filter-commune"
        label="Commune"
        value={filters.commune}
        options={[
          { value: "tous", label: "Commune" },
          ...communeOptions.map((option) => ({ ...option, label: `${option.label} (${option.count})` })),
        ]}
        onChange={(commune) => onFiltersChange({ ...filters, commune })}
        className="col-span-2 sm:col-span-1"
      />
      <button
        type="button"
        onClick={onReset}
        disabled={activeCount === 0}
        aria-label={activeCount > 0 ? `Réinitialiser ${activeCount > 1 ? `les ${activeCount} filtres` : "le filtre"}` : "Aucun filtre actif"}
        title="Réinitialiser les filtres"
        className={cn(
          proprietairesControl,
          focusRing,
          "relative col-span-2 inline-flex cursor-pointer items-center justify-center gap-2 px-4 font-medium disabled:cursor-default disabled:opacity-60 sm:col-span-1 sm:w-12 sm:px-0",
        )}
      >
        <Icon name="sliders" className="size-5" />
        <span className="sm:sr-only">Réinitialiser</span>
        {activeCount > 0 ? (
          <span className="grid size-5 place-items-center rounded-full bg-brand-600 text-[11px] font-semibold text-white sm:absolute sm:-top-1.5 sm:-right-1.5">
            {activeCount}
          </span>
        ) : null}
      </button>
    </div>
  );
}

function FilterSelect({
  id,
  label,
  value,
  options,
  onChange,
  className,
}: {
  id: string;
  label: string;
  value: string;
  options: ProprietaireOption[];
  onChange: (value: string) => void;
  className?: string;
}) {
  const active = value !== "tous";
  return (
    <div className={cn("relative min-w-0", className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          proprietairesControl,
          focusRing,
          "w-full cursor-pointer appearance-none truncate pr-10 pl-4 font-medium sm:w-auto sm:max-w-60",
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

export type ProprietairesQuickFiltersProps = {
  value: ProprietaireQuickFilter;
  options: { value: ProprietaireQuickFilter; label: string; count: number }[];
  onChange: (value: ProprietaireQuickFilter) => void;
};

/** Chips "Tous · Actifs · À reverser · Diaspora · Mandat simple · Fin de mandat proche" with live counts. */
export function ProprietairesQuickFilters({ value, options, onChange }: ProprietairesQuickFiltersProps) {
  return (
    <div role="group" aria-label="Filtres rapides" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors",
              focusRing,
              active
                ? "bg-brand-600 text-white dark:bg-brand-500"
                : "bg-white text-zinc-700 ring-1 ring-zinc-200 hover:bg-zinc-50 dark:bg-zinc-950 dark:text-zinc-200 dark:ring-white/10 dark:hover:bg-white/5",
            )}
          >
            {option.value === "a_reverser" ? (
              <span aria-hidden="true" className={cn("size-1.5 rounded-full", active ? "bg-white" : "bg-orange-500")} />
            ) : null}
            {option.label}
            <span
              className={cn(
                "rounded-full px-1.5 text-xs tabular-nums",
                active
                  ? "bg-white/20 text-white"
                  : option.value === "a_reverser" && option.count > 0
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-zinc-500 dark:text-zinc-400",
              )}
            >
              {option.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export type ProprietairesViewSwitchProps = {
  view: ProprietaireView;
  onViewChange: (view: ProprietaireView) => void;
};

const views: { value: ProprietaireView; label: string; icon: "dashboard" | "mapPin" }[] = [
  { value: "tableau", label: "Tableau", icon: "dashboard" },
  { value: "carte", label: "Carte", icon: "mapPin" },
];

export function ProprietairesViewSwitch({ view, onViewChange }: ProprietairesViewSwitchProps) {
  return (
    <div
      role="group"
      aria-label="Affichage"
      className="inline-flex h-12 shrink-0 rounded-2xl border border-zinc-200 bg-white p-1 dark:border-white/10 dark:bg-zinc-950"
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
  );
}
