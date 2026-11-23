import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { COMPTABILITE_CATEGORIES } from "../hooks/comptabilites_categories";
import type {
  ComptabiliteAdvancedFilters,
  ComptabiliteCategory,
  ComptabiliteFilters,
  ComptabiliteOption,
  ComptabiliteView,
} from "../types";
import { comptabilitesControl } from "./comptabilites_styles";

const flowOptions: ComptabiliteOption<ComptabiliteFilters["flow"]>[] = [
  { value: "tous", label: "Type d'opération" },
  { value: "recette", label: "Recettes" },
  { value: "depense", label: "Dépenses" },
];

const periodOptions: ComptabiliteOption<ComptabiliteFilters["period"]>[] = [
  { value: "mois", label: "Période : ce mois" },
  { value: "15_jours", label: "15 derniers jours" },
  { value: "7_jours", label: "7 derniers jours" },
];

const statusOptions: ComptabiliteOption<ComptabiliteAdvancedFilters["status"]>[] = [
  { value: "tous", label: "Tous les statuts" },
  { value: "regle", label: "Reçu / payée" },
  { value: "en_cours", label: "En cours" },
  { value: "en_attente", label: "En attente" },
];

export type ComptabilitesFiltersProps = {
  filters: ComptabiliteFilters;
  onFiltersChange: (filters: ComptabiliteFilters) => void;
  advancedOpen: boolean;
  onAdvancedToggle: () => void;
  advancedCount: number;
  className?: string;
};

/** Type, category and period dropdowns, and the "Filtres avancés" toggle. */
export function ComptabilitesFilters({
  filters,
  onFiltersChange,
  advancedOpen,
  onAdvancedToggle,
  advancedCount,
  className,
}: ComptabilitesFiltersProps) {
  const categories = (Object.keys(COMPTABILITE_CATEGORIES) as ComptabiliteCategory[]).filter(
    (category) => filters.flow === "tous" || COMPTABILITE_CATEGORIES[category].flow === filters.flow,
  );
  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center", className)}>
      <Select
        id="comptabilites-filter-flow"
        label="Type d'opération"
        value={filters.flow}
        options={flowOptions}
        onChange={(flow) => onFiltersChange({ ...filters, flow: flow as ComptabiliteFilters["flow"] })}
      />
      <Select
        id="comptabilites-filter-category"
        label="Catégorie"
        value={filters.category}
        options={[
          { value: "tous", label: "Catégorie" },
          ...categories.map((category) => ({ value: category, label: COMPTABILITE_CATEGORIES[category].label })),
        ]}
        onChange={(category) => onFiltersChange({ ...filters, category: category as ComptabiliteFilters["category"] })}
      />
      <Select
        id="comptabilites-filter-period"
        label="Période"
        value={filters.period}
        active={filters.period !== "mois"}
        options={periodOptions}
        onChange={(period) => onFiltersChange({ ...filters, period: period as ComptabiliteFilters["period"] })}
      />
      <button
        type="button"
        aria-expanded={advancedOpen}
        aria-controls="comptabilites-advanced"
        onClick={onAdvancedToggle}
        className={cn(
          "inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold transition-colors",
          focusRing,
          advancedOpen || advancedCount > 0
            ? "bg-brand-600 text-white shadow-sm hover:bg-brand-700 dark:bg-brand-500"
            : "border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200",
        )}
      >
        <Icon name="filter" className="size-4.5" />
        Filtres avancés
        {advancedCount > 0 ? (
          <span className="grid size-5 place-items-center rounded-full bg-white text-[11px] font-bold text-brand-700">
            {advancedCount}
          </span>
        ) : null}
        <Icon name="chevronDown" className={cn("size-4 transition-transform", advancedOpen && "rotate-180")} />
      </button>
    </div>
  );
}

export type ComptabilitesAdvancedFiltersProps = {
  advanced: ComptabiliteAdvancedFilters;
  onAdvancedChange: (advanced: ComptabiliteAdvancedFilters) => void;
  biens: string[];
  onResetAll: () => void;
};

/** Status, property and amount range. */
export function ComptabilitesAdvancedFilters({ advanced, onAdvancedChange, biens, onResetAll }: ComptabilitesAdvancedFiltersProps) {
  const amount = (value: string) => (value.trim() === "" ? null : Math.max(0, Number(value.replace(/\s/g, "")) || 0));
  return (
    <div
      id="comptabilites-advanced"
      className="grid gap-3 rounded-3xl border border-brand-100 bg-brand-50/40 p-4 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto] dark:border-brand-800/50 dark:bg-brand-950/30"
    >
      <Select
        id="comptabilites-advanced-status"
        label="Statut"
        value={advanced.status}
        options={statusOptions}
        onChange={(status) => onAdvancedChange({ ...advanced, status: status as ComptabiliteAdvancedFilters["status"] })}
        wide
      />
      <Select
        id="comptabilites-advanced-bien"
        label="Bien concerné"
        value={advanced.bien}
        options={[{ value: "tous", label: "Tous les biens" }, ...biens.map((bien) => ({ value: bien, label: bien }))]}
        onChange={(bien) => onAdvancedChange({ ...advanced, bien })}
        wide
      />
      <AmountInput
        id="comptabilites-advanced-min"
        label="Montant min. (FCFA)"
        value={advanced.minAmount}
        onChange={(value) => onAdvancedChange({ ...advanced, minAmount: amount(value) })}
      />
      <AmountInput
        id="comptabilites-advanced-max"
        label="Montant max. (FCFA)"
        value={advanced.maxAmount}
        onChange={(value) => onAdvancedChange({ ...advanced, maxAmount: amount(value) })}
      />
      <button
        type="button"
        onClick={onResetAll}
        className={cn(
          "inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold text-brand-700 hover:bg-brand-100/60 dark:text-brand-100 dark:hover:bg-brand-900/40",
          focusRing,
        )}
      >
        <Icon name="reset" className="size-4" />
        Tout réinitialiser
      </button>
    </div>
  );
}

function AmountInput({ id, label, value, onChange }: { id: string; label: string; value: number | null; onChange: (value: string) => void }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={0}
        step={1000}
        value={value ?? ""}
        placeholder={label}
        onChange={(event) => onChange(event.target.value)}
        className={cn(comptabilitesControl, focusRing, "w-full px-4 tabular-nums placeholder:text-zinc-400")}
      />
    </div>
  );
}

function Select({
  id,
  label,
  value,
  options,
  onChange,
  active = value !== "tous",
  wide = false,
}: {
  id: string;
  label: string;
  value: string;
  options: ComptabiliteOption[];
  onChange: (value: string) => void;
  active?: boolean;
  wide?: boolean;
}) {
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
          comptabilitesControl,
          focusRing,
          "w-full cursor-pointer appearance-none truncate pr-10 pl-4 font-medium",
          !wide && "sm:w-auto sm:max-w-52",
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

export type ComptabilitesViewSwitchProps = {
  view: ComptabiliteView;
  onViewChange: (view: ComptabiliteView) => void;
};

const views: { value: ComptabiliteView; label: string; icon: IconName }[] = [
  { value: "tableau", label: "Tableau", icon: "dashboard" },
  { value: "graphique", label: "Graphique", icon: "trendUp" },
];

export function ComptabilitesViewSwitch({ view, onViewChange }: ComptabilitesViewSwitchProps) {
  return (
    <div
      role="group"
      aria-label="Affichage des opérations"
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
