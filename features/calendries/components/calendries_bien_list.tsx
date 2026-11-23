import { Icon } from "@/components/ui/icon";
import { PropertyThumbnail } from "@/components/ui/property_thumbnail";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import type { UseCalendriesBiensResult } from "../hooks/use_calendries_biens";
import type { CalendrieAvailability } from "../types";
import { AvailabilityBadge } from "./calendries_parts";
import { calendriesControl, calendriesPanel } from "./calendries_styles";

const filters: { value: CalendrieAvailability | "tous"; label: string }[] = [
  { value: "tous", label: "Tous les biens" },
  { value: "disponible", label: "Disponibles aujourd'hui" },
  { value: "indisponible", label: "Indisponibles aujourd'hui" },
];

export type CalendriesBienListProps = {
  list: UseCalendriesBiensResult;
  className?: string;
};

/** "Sélectionner un bien": search, availability filter and the list. */
export function CalendriesBienList({ list, className }: CalendriesBienListProps) {
  return (
    <section aria-labelledby="calendries-biens-title" className={cn(calendriesPanel, "flex min-h-0 flex-col gap-4 p-5", className)}>
      <h2 id="calendries-biens-title" className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
        Sélectionner un bien
      </h2>
      <div className="flex gap-2">
        <form role="search" onSubmit={(event) => event.preventDefault()} className="relative min-w-0 flex-1">
          <label htmlFor="calendries-search" className="sr-only">
            Rechercher un bien
          </label>
          <Icon name="search" className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-zinc-400" />
          <input
            id="calendries-search"
            type="search"
            value={list.query}
            onChange={(event) => list.setQuery(event.target.value)}
            placeholder="Rechercher un bien…"
            className={cn(calendriesControl, focusRing, "h-11 w-full pr-3 pl-10 placeholder:text-zinc-400")}
          />
        </form>
        <div className="relative">
          <label htmlFor="calendries-filter" className="sr-only">
            Filtrer par disponibilité
          </label>
          <select
            id="calendries-filter"
            value={list.filter}
            onChange={(event) => list.setFilter(event.target.value as CalendrieAvailability | "tous")}
            title="Filtrer par disponibilité"
            className={cn(
              calendriesControl,
              focusRing,
              "h-11 w-11 cursor-pointer appearance-none text-transparent",
              list.filter !== "tous" && "border-brand-300 bg-brand-50 dark:border-brand-500/60 dark:bg-brand-900/30",
            )}
          >
            {filters.map((filter) => (
              <option key={filter.value} value={filter.value} className="text-zinc-900">
                {filter.label}
              </option>
            ))}
          </select>
          <Icon name="filter" className="pointer-events-none absolute top-1/2 left-1/2 size-4.5 -translate-1/2 text-brand-600 dark:text-brand-100" />
        </div>
      </div>
      {list.filter !== "tous" ? (
        <p className="-mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          {filters.find((filter) => filter.value === list.filter)?.label} · {list.results.length}
        </p>
      ) : null}

      <ul className="-mx-1 flex max-h-[34rem] flex-col gap-1.5 overflow-y-auto px-1 py-1">
        {list.results.map((bien) => {
          const selected = list.selected?.id === bien.id;
          return (
            <li key={bien.id}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => list.select(bien.id)}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-2xl p-2.5 text-left transition-colors",
                  focusRing,
                  selected
                    ? "bg-brand-50/70 ring-2 ring-brand-500 dark:bg-brand-900/30"
                    : "hover:bg-zinc-50 dark:hover:bg-white/5",
                )}
              >
                <PropertyThumbnail kind={bien.kind} photoUrl={bien.photoUrl} compact className="h-12 w-16 shrink-0 rounded-xl" />
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-sm leading-snug font-semibold text-zinc-900 dark:text-zinc-100">{bien.title}</span>
                  <span className="mt-0.5 block truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {bien.quartier}, {bien.city}
                  </span>
                </span>
                <AvailabilityBadge availability={list.availabilityToday(bien.id)} className="shrink-0" />
              </button>
            </li>
          );
        })}
        {list.results.length === 0 ? (
          <li className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">Aucun bien ne correspond.</li>
        ) : null}
      </ul>
    </section>
  );
}
