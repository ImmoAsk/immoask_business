"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { availabilityOn, periodOn, periodsOf } from "../hooks/calendries_availability";
import {
  addDays,
  consecutiveRuns,
  diffDays,
  formatDay,
  formatLongDay,
  formatMonth,
  monthWeeks,
} from "../hooks/calendries_dates";
import type { UseCalendriesNavigationResult } from "../hooks/use_calendries_navigation";
import type { CalendrieBien, CalendriePeriod, CalendrieView } from "../types";
import { AvailabilityBadge, ReasonBadge } from "./calendries_parts";
import { calendriesPanel, freeBar, reasons } from "./calendries_styles";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const views: { value: CalendrieView; label: string }[] = [
  { value: "mois", label: "Mois" },
  { value: "semaine", label: "Semaine" },
  { value: "jour", label: "Jour" },
];

type Segment = {
  key: string;
  from: number;
  to: number;
  period: CalendriePeriod | null;
  continuesLeft: boolean;
  continuesRight: boolean;
};

/** Bars of one week: blocked periods, and the free stretches between them. */
function weekSegments(days: string[], periods: CalendriePeriod[]): Segment[] {
  const first = days[0];
  const last = days[6];
  const blocked: Segment[] = periods
    .filter((period) => period.start <= last && period.end >= first)
    .map((period) => ({
      key: period.id,
      from: diffDays(first, period.start < first ? first : period.start),
      to: diffDays(first, period.end > last ? last : period.end),
      period,
      continuesLeft: period.start < first,
      continuesRight: period.end > last,
    }));
  const freeDays = days.filter((day) => !periods.some((period) => day >= period.start && day <= period.end));
  const free: Segment[] = consecutiveRuns(freeDays).map(([start, end]) => ({
    key: `free-${start}`,
    from: diffDays(first, start),
    to: diffDays(first, end),
    period: null,
    continuesLeft: false,
    continuesRight: false,
  }));
  return [...blocked, ...free];
}

export type CalendriesCalendarProps = {
  bien: CalendrieBien | null;
  periods: CalendriePeriod[];
  asOf: string;
  navigation: UseCalendriesNavigationResult;
  /** Days picked in the form, highlighted. */
  draftDays: string[];
  onPickDay: (day: string) => void;
  onRemovePeriod: (id: string) => void;
  className?: string;
};

export function CalendriesCalendar({
  bien,
  periods,
  asOf,
  navigation,
  draftDays,
  onPickDay,
  onRemovePeriod,
  className,
}: CalendriesCalendarProps) {
  if (!bien) {
    return (
      <section className={cn(calendriesPanel, "grid place-items-center p-10 text-sm text-zinc-500", className)}>
        Sélectionnez un bien pour voir son calendrier.
      </section>
    );
  }

  const own = periodsOf(periods, bien.id);
  const { view, cursor, month, weekStart } = navigation;
  const label =
    view === "mois"
      ? formatMonth(month)
      : view === "semaine"
        ? `Semaine du ${formatDay(weekStart)} au ${formatDay(addDays(weekStart, 6))}`
        : formatLongDay(cursor).replace(/^./, (c) => c.toUpperCase());

  return (
    <section aria-labelledby="calendries-calendar-title" className={cn(calendriesPanel, "flex min-w-0 flex-col gap-4 p-5", className)}>
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 id="calendries-calendar-title" className="text-xl leading-tight font-semibold text-zinc-950 dark:text-zinc-50">
            {bien.title}
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {bien.quartier}, {bien.city} · Réf. {bien.reference}
          </p>
        </div>
        <AvailabilityBadge availability={availabilityOn(periods, bien.id, asOf)} className="mt-1 shrink-0" />
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-1.5">
          <NavButton label="Précédent" icon="chevronLeft" onClick={navigation.previous} />
          <NavButton label="Suivant" icon="chevronRight" onClick={navigation.next} />
          <p aria-live="polite" className="ml-1.5 truncate text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {label}
          </p>
          <button
            type="button"
            onClick={navigation.today}
            className={cn(
              "ml-1 h-8 shrink-0 cursor-pointer rounded-lg px-2.5 text-xs font-semibold text-brand-700 hover:bg-brand-50 dark:text-brand-100 dark:hover:bg-brand-900/40",
              focusRing,
            )}
          >
            Aujourd&apos;hui
          </button>
        </div>
        <div role="group" aria-label="Affichage du calendrier" className="inline-flex rounded-xl border border-zinc-200 p-0.5 dark:border-white/10">
          {views.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={view === item.value}
              onClick={() => navigation.setView(item.value)}
              className={cn(
                "h-8 cursor-pointer rounded-lg px-3.5 text-sm font-semibold transition-colors",
                focusRing,
                view === item.value
                  ? "bg-brand-600 text-white dark:bg-brand-500"
                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {view === "jour" ? (
        <DayView bien={bien} periods={periods} day={cursor} asOf={asOf} onPickDay={onPickDay} onRemovePeriod={onRemovePeriod} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-100 dark:border-white/10">
          <div className="grid grid-cols-7 bg-zinc-50/80 text-center text-xs font-semibold text-zinc-600 dark:bg-white/5 dark:text-zinc-300">
            {WEEKDAYS.map((day, index) => (
              <span key={day} className="py-2">
                {day}
                {view === "semaine" ? (
                  <span className="block text-[11px] font-medium text-zinc-500">{formatDay(addDays(weekStart, index)).slice(0, 5)}</span>
                ) : null}
              </span>
            ))}
          </div>
          {(view === "mois" ? monthWeeks(month) : [Array.from({ length: 7 }, (_, index) => addDays(weekStart, index))]).map(
            (days) => (
              <WeekRow
                key={days[0]}
                days={days}
                periods={own}
                month={view === "mois" ? month : null}
                asOf={asOf}
                draftDays={draftDays}
                tall={view === "semaine"}
                onPickDay={onPickDay}
                onOpenDay={(day) => navigation.goTo(day, "jour")}
              />
            ),
          )}
        </div>
      )}

      <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-zinc-600 dark:text-zinc-300" aria-label="Légende">
        {(Object.keys(reasons) as (keyof typeof reasons)[]).map((reason) => (
          <li key={reason} className="flex items-center gap-1.5">
            <span aria-hidden="true" className={cn("size-2.5 rounded-sm", reasons[reason].swatch)} />
            {reasons[reason].label}
          </li>
        ))}
        <li className="flex items-center gap-1.5">
          <span aria-hidden="true" className={cn("size-2.5 rounded-sm", freeBar)} />
          Disponible
        </li>
        <li className="flex items-center gap-1.5">
          <span aria-hidden="true" className="size-2.5 rounded-sm ring-2 ring-brand-400 ring-inset" />
          Sélection en cours
        </li>
      </ul>
      <p className="-mt-2 text-xs text-zinc-500 dark:text-zinc-400">
        Cliquez sur les jours pour remplir la période ; double-cliquez pour ouvrir la journée.
      </p>
    </section>
  );
}

function NavButton({ label, icon, onClick }: { label: string; icon: "chevronLeft" | "chevronRight"; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/5",
        focusRing,
      )}
    >
      <Icon name={icon} className="size-4" />
    </button>
  );
}

function WeekRow({
  days,
  periods,
  month,
  asOf,
  draftDays,
  tall,
  onPickDay,
  onOpenDay,
}: {
  days: string[];
  periods: CalendriePeriod[];
  month: string | null;
  asOf: string;
  draftDays: string[];
  tall: boolean;
  onPickDay: (day: string) => void;
  onOpenDay: (day: string) => void;
}) {
  const segments = weekSegments(days, periods);
  return (
    <div className={cn("relative grid grid-cols-7 border-t border-zinc-100 dark:border-white/10", tall ? "h-48" : "h-[5.25rem]")}>
      {days.map((day, index) => {
        const outside = month !== null && day.slice(0, 7) !== month.slice(0, 7);
        const period = periods.find((item) => day >= item.start && day <= item.end) ?? null;
        const picked = draftDays.includes(day);
        return (
          <button
            key={day}
            type="button"
            aria-pressed={picked}
            aria-label={`${formatLongDay(day)} — ${period ? `indisponible : ${reasons[period.reason].label}` : "disponible"}`}
            onClick={() => onPickDay(day)}
            onDoubleClick={() => onOpenDay(day)}
            className={cn(
              "flex cursor-pointer flex-col items-start p-1.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-inset",
              index > 0 && "border-l border-zinc-100 dark:border-white/10",
              picked ? "bg-brand-100/60 ring-2 ring-brand-400 ring-inset dark:bg-brand-800/40" : "hover:bg-zinc-50 dark:hover:bg-white/[0.03]",
            )}
          >
            <span
              className={cn(
                "grid size-6 place-items-center rounded-full text-xs font-semibold tabular-nums",
                day === asOf
                  ? "bg-brand-600 text-white dark:bg-brand-500"
                  : outside
                    ? "text-zinc-300 dark:text-zinc-600"
                    : "text-zinc-700 dark:text-zinc-300",
              )}
            >
              {Number(day.slice(8, 10))}
            </span>
          </button>
        );
      })}

      {/* Bars sit over the days but let clicks through to them. */}
      <div className="pointer-events-none absolute inset-x-0 top-8 grid grid-cols-7" aria-hidden="true">
        {segments.map((segment) => (
          <span
            key={segment.key}
            style={{ gridColumn: `${segment.from + 1} / ${segment.to + 2}`, gridRow: 1 }}
            title={
              segment.period
                ? `${reasons[segment.period.reason].label} · ${formatDay(segment.period.start)} → ${formatDay(segment.period.end)}${segment.period.comment ? ` · ${segment.period.comment}` : ""}`
                : "Disponible"
            }
            className={cn(
              "flex min-w-0 flex-col justify-center overflow-hidden px-2 text-[11px] leading-tight font-semibold",
              tall ? "h-auto min-h-9 py-1.5" : "h-7",
              segment.period ? reasons[segment.period.reason].bar : freeBar,
              segment.continuesLeft ? "rounded-l-none" : "ml-1 rounded-l-lg",
              segment.continuesRight ? "rounded-r-none" : "mr-1 rounded-r-lg",
              !segment.period && month !== null && days.slice(segment.from, segment.to + 1).every((day) => day.slice(0, 7) !== month.slice(0, 7)) && "opacity-50",
            )}
          >
            <span className="truncate">{segment.period ? reasons[segment.period.reason].label : "Disponible"}</span>
            {tall && segment.period ? (
              <span className="truncate font-medium opacity-90">
                {segment.period.start === segment.period.end
                  ? formatDay(segment.period.start).slice(0, 5)
                  : `${formatDay(segment.period.start).slice(0, 5)} → ${formatDay(segment.period.end).slice(0, 5)}`}
                {segment.period.comment ? ` · ${segment.period.comment}` : ""}
              </span>
            ) : null}
          </span>
        ))}
      </div>
    </div>
  );
}

function DayView({
  bien,
  periods,
  day,
  asOf,
  onPickDay,
  onRemovePeriod,
}: {
  bien: CalendrieBien;
  periods: CalendriePeriod[];
  day: string;
  asOf: string;
  onPickDay: (day: string) => void;
  onRemovePeriod: (id: string) => void;
}) {
  const period = periodOn(periods, bien.id, day);
  const [confirming, setConfirming] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-zinc-100 p-5 dark:border-white/10">
      <div className="flex flex-wrap items-center gap-3">
        <AvailabilityBadge availability={period ? "indisponible" : "disponible"} />
        {day === asOf ? <span className="text-xs font-semibold text-brand-700 dark:text-brand-100">Aujourd&apos;hui</span> : null}
      </div>
      {period ? (
        <>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            <dt className="text-zinc-500 dark:text-zinc-400">Motif</dt>
            <dd>
              <ReasonBadge reason={period.reason} />
            </dd>
            <dt className="text-zinc-500 dark:text-zinc-400">Période</dt>
            <dd className="font-semibold text-zinc-900 tabular-nums dark:text-zinc-100">
              {formatDay(period.start)} → {formatDay(period.end)}
            </dd>
            {period.comment ? (
              <>
                <dt className="text-zinc-500 dark:text-zinc-400">Commentaire</dt>
                <dd className="text-zinc-800 dark:text-zinc-200">{period.comment}</dd>
              </>
            ) : null}
          </dl>
          <button
            type="button"
            onClick={() => {
              if (confirming === period.id) onRemovePeriod(period.id);
              else setConfirming(period.id);
            }}
            className={cn(
              "inline-flex h-10 w-fit cursor-pointer items-center gap-2 rounded-xl px-4 text-sm font-semibold",
              confirming === period.id
                ? "bg-red-600 text-white hover:bg-red-700"
                : "border border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40",
              focusRing,
            )}
          >
            <Icon name="close" className="size-4" />
            {confirming === period.id ? "Confirmer la suppression" : "Rendre disponible (supprimer la période)"}
          </button>
        </>
      ) : (
        <>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">Aucune indisponibilité ce jour : le bien peut être réservé.</p>
          <button
            type="button"
            onClick={() => onPickDay(day)}
            className={cn(
              "inline-flex h-10 w-fit cursor-pointer items-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700 dark:bg-brand-500",
              focusRing,
            )}
          >
            <Icon name="lock" className="size-4" />
            Bloquer ce jour
          </button>
        </>
      )}
    </div>
  );
}
