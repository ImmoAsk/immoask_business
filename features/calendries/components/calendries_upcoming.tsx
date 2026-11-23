"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { PropertyThumbnail } from "@/components/ui/property_thumbnail";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { formatDateTime, formatDay } from "../hooks/calendries_dates";
import type { CalendrieBien, CalendriePeriod } from "../types";
import { ReasonBadge } from "./calendries_parts";
import { calendriesPanel } from "./calendries_styles";

const SHOWN = 5;
const headCell = "px-3 py-3 text-left text-xs font-semibold whitespace-nowrap text-zinc-500 dark:text-zinc-400";
const link = cn("inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium", focusRing);

export type CalendriesUpcomingProps = {
  biens: CalendrieBien[];
  periods: CalendriePeriod[];
  asOf: string;
  onView: (period: CalendriePeriod) => void;
  onRemove: (id: string) => void;
  className?: string;
};

/** Periods not over yet, soonest first. Deleting asks for a second click. */
export function CalendriesUpcoming({ biens, periods, asOf, onView, onRemove, className }: CalendriesUpcomingProps) {
  const [showAll, setShowAll] = useState(false);
  const [confirming, setConfirming] = useState<string | null>(null);
  const upcoming = periods.filter((period) => period.end >= asOf).sort((a, b) => a.start.localeCompare(b.start) || a.bienId.localeCompare(b.bienId));
  const shown = showAll ? upcoming : upcoming.slice(0, SHOWN);
  const bienOf = (id: string) => biens.find((bien) => bien.id === id);

  const remove = (period: CalendriePeriod) => {
    if (confirming === period.id) {
      onRemove(period.id);
      setConfirming(null);
    } else setConfirming(period.id);
  };

  const actions = (period: CalendriePeriod) => (
    <div className="flex items-center justify-end gap-1">
      <button type="button" onClick={() => onView(period)} className={cn(link, "text-brand-700 hover:bg-brand-50 dark:text-brand-100 dark:hover:bg-brand-900/40")}>
        <Icon name="eye" className="size-4" /> Voir
      </button>
      <button
        type="button"
        onClick={() => remove(period)}
        onBlur={() => setConfirming((id) => (id === period.id ? null : id))}
        className={cn(
          link,
          confirming === period.id
            ? "bg-red-600 text-white hover:bg-red-700"
            : "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40",
        )}
      >
        <Icon name="close" className="size-4" /> {confirming === period.id ? "Confirmer" : "Supprimer"}
      </button>
    </div>
  );

  return (
    <section aria-labelledby="calendries-upcoming-title" className={cn(calendriesPanel, "overflow-hidden", className)}>
      <header className="flex items-center justify-between gap-3 px-5 py-4">
        <h2 id="calendries-upcoming-title" className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          Périodes d&apos;indisponibilité à venir <span className="text-sm font-medium text-zinc-500">({upcoming.length})</span>
        </h2>
        {upcoming.length > SHOWN ? (
          <button
            type="button"
            onClick={() => setShowAll((value) => !value)}
            className={cn(link, "text-brand-700 hover:bg-brand-50 dark:text-brand-100 dark:hover:bg-brand-900/40")}
          >
            {showAll ? "Voir moins" : "Voir tout"}
            <Icon name="arrowRight" className={cn("size-4", showAll && "-rotate-90")} />
          </button>
        ) : null}
      </header>

      {upcoming.length === 0 ? (
        <p className="px-5 pb-6 text-sm text-zinc-500 dark:text-zinc-400">Aucune indisponibilité à venir.</p>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[760px] table-fixed border-collapse text-sm">
              <thead className="border-y border-zinc-100 bg-zinc-50/80 dark:border-white/10 dark:bg-white/5">
                <tr>
                  <th scope="col" className={cn(headCell, "w-[34%] pl-5")}>Bien</th>
                  <th scope="col" className={cn(headCell, "w-[22%]")}>Période</th>
                  <th scope="col" className={cn(headCell, "w-44")}>Motif</th>
                  <th scope="col" className={cn(headCell, "w-36")}>Créé le</th>
                  <th scope="col" className={cn(headCell, "w-52 pr-5 text-right")}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-white/10">
                {shown.map((period) => {
                  const bien = bienOf(period.bienId);
                  return (
                    <tr key={period.id} className="hover:bg-zinc-50/70 dark:hover:bg-white/[0.03]">
                      <td className="py-2.5 pr-3 pl-5">
                        <span className="flex min-w-0 items-center gap-3">
                          {bien ? <PropertyThumbnail kind={bien.kind} compact className="h-8 w-10 shrink-0 rounded-lg [&_svg]:size-4" /> : null}
                          <span className="truncate text-zinc-900 dark:text-zinc-100" title={bien?.title}>
                            {bien?.title ?? "—"}
                          </span>
                        </span>
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-zinc-800 tabular-nums dark:text-zinc-200">
                        {formatDay(period.start)} <span className="text-zinc-400">→</span> {formatDay(period.end)}
                      </td>
                      <td className="px-3 py-2.5">
                        <ReasonBadge reason={period.reason} />
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-zinc-600 tabular-nums dark:text-zinc-400">
                        {formatDateTime(period.createdAt)}
                      </td>
                      <td className="py-2.5 pr-5 pl-3">{actions(period)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <ul className="flex flex-col divide-y divide-zinc-100 border-t border-zinc-100 md:hidden dark:divide-white/10 dark:border-white/10">
            {shown.map((period) => {
              const bien = bienOf(period.bienId);
              return (
                <li key={period.id} className="flex flex-col gap-2 px-5 py-3">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">{bien?.title ?? "—"}</p>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-700 tabular-nums dark:text-zinc-300">
                    {formatDay(period.start)} → {formatDay(period.end)}
                    <ReasonBadge reason={period.reason} />
                  </div>
                  {actions(period)}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}
