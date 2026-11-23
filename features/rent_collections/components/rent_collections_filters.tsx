import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import type { RentCollectionFilters, RentCollectionOption, RentCollectionQuickFilter } from "../types";
import { rentCollectionsControl } from "./rent_collections_styles";

const natureOptions: RentCollectionOption<RentCollectionFilters["nature"]>[] = [
  { value: "tous", label: "Prestations et services" },
  { value: "loyer", label: "Loyers" },
  { value: "charges", label: "Charges locatives" },
  { value: "caution", label: "Cautions" },
  { value: "service", label: "Services" },
];

const channelOptions: RentCollectionOption<RentCollectionFilters["channel"]>[] = [
  { value: "tous", label: "Canal : tous" },
  { value: "mobile_money", label: "Mobile Money" },
  { value: "virement", label: "Virement" },
  { value: "especes", label: "Espèces" },
];

export type RentCollectionsFiltersProps = {
  filters: RentCollectionFilters;
  onFiltersChange: (filters: RentCollectionFilters) => void;
  tenantOptions: RentCollectionOption[];
  /** Number of active criteria (search, chip, dropdowns); enables the reset button. */
  activeCount: number;
  onReset: () => void;
  className?: string;
};

/** The three dropdowns and the reset button. */
export function RentCollectionsFilters({
  filters,
  onFiltersChange,
  tenantOptions,
  activeCount,
  onReset,
  className,
}: RentCollectionsFiltersProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center", className)}>
      <FilterSelect
        id="rent-collections-filter-nature"
        label="Prestations et services"
        value={filters.nature}
        options={natureOptions}
        onChange={(nature) => onFiltersChange({ ...filters, nature: nature as RentCollectionFilters["nature"] })}
      />
      <FilterSelect
        id="rent-collections-filter-channel"
        label="Canal"
        value={filters.channel}
        options={channelOptions}
        onChange={(channel) => onFiltersChange({ ...filters, channel: channel as RentCollectionFilters["channel"] })}
      />
      <FilterSelect
        id="rent-collections-filter-tenant"
        label="Locataire"
        value={filters.tenant}
        options={[{ value: "tous", label: "Locataire" }, ...tenantOptions]}
        onChange={(tenant) => onFiltersChange({ ...filters, tenant })}
        className="col-span-2 sm:col-span-1"
      />
      <button
        type="button"
        onClick={onReset}
        disabled={activeCount === 0}
        aria-label={activeCount > 0 ? `Réinitialiser ${activeCount > 1 ? `les ${activeCount} filtres` : "le filtre"}` : "Aucun filtre actif"}
        title="Réinitialiser les filtres"
        className={cn(
          rentCollectionsControl,
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
  options: RentCollectionOption[];
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
          rentCollectionsControl,
          focusRing,
          "w-full cursor-pointer appearance-none truncate pr-10 pl-4 font-medium sm:w-auto sm:max-w-56",
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

export type RentCollectionsQuickFiltersProps = {
  value: RentCollectionQuickFilter;
  options: { value: RentCollectionQuickFilter; label: string; count: number }[];
  onChange: (value: RentCollectionQuickFilter) => void;
};

/** Chips "Tous · Loyers réglés · En attente · Services et cautions · Mobile Money" with live counts. */
export function RentCollectionsQuickFilters({ value, options, onChange }: RentCollectionsQuickFiltersProps) {
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
            {option.value === "en_attente" ? (
              <span aria-hidden="true" className={cn("size-1.5 rounded-full", active ? "bg-white" : "bg-orange-500")} />
            ) : null}
            {option.label}
            <span
              className={cn(
                "rounded-full px-1.5 text-xs tabular-nums",
                active
                  ? "bg-white/20 text-white"
                  : option.value === "en_attente" && option.count > 0
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
