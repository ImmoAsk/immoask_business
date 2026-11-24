import { useId } from "react";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import type { ReservationKpis } from "../types";
import { reservationsPanel } from "./reservations_styles";

const card = cn(reservationsPanel, "relative flex min-w-0 flex-col gap-3.5 overflow-hidden p-6 xl:p-5 2xl:p-6");
const value = "text-[38px] leading-none font-bold tracking-tight text-zinc-950 tabular-nums xl:text-[32px] 2xl:text-[38px] dark:text-zinc-50";
const unit = "text-[15px] font-semibold text-zinc-500 dark:text-zinc-400";
const rowButton = cn(
  "mt-auto flex h-[42px] w-full cursor-pointer items-center gap-2 rounded-xl px-3.5 text-left text-[13.5px] font-semibold transition-colors disabled:cursor-default disabled:opacity-60",
  focusRing,
);

export type ReservationsKpiProps = {
  kpis: ReservationKpis;
  /** "Voir les séjours en cours". */
  onShowInProgress: () => void;
  /** "N nuitées au total". */
  onShowDone: () => void;
};

export function ReservationsKpi({ kpis, onShowInProgress, onShowDone }: ReservationsKpiProps) {
  const { newOnes, inProgress, departures, done } = kpis;
  const occupied = Math.round(inProgress.occupiedPercent);

  return (
    <section aria-label="Indicateurs des réservations" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <article className={card}>
        <Sparkline values={newOnes.history} />
        <Heading icon="bell" tile="bg-brand-600 text-white shadow-[0_8px_18px_-6px_rgba(10,116,174,0.6)] dark:bg-brand-500">
          Nouvelles réservations
        </Heading>
        <p className="flex flex-wrap items-baseline gap-2">
          <span className={value}>{newOnes.count}</span>
          <span className={unit}>à confirmer</span>
        </p>
        <p className="mt-auto">
          <span className="inline-flex rounded-xl bg-brand-50 px-3 py-1.5 text-[13px] font-semibold text-brand-800 dark:bg-brand-900/60 dark:text-brand-100">
            {newOnes.total} réservation{newOnes.total > 1 ? "s" : ""} au total
          </span>
        </p>
      </article>

      <article className={card}>
        <Heading icon="bed" tile="bg-brand-900 text-white dark:bg-brand-300 dark:text-brand-950">
          Séjours en cours
          <span className="ml-auto shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold whitespace-nowrap text-brand-700 dark:bg-brand-900/60 dark:text-brand-100">
            {occupied} % occupés
          </span>
        </Heading>
        <p className="flex flex-wrap items-baseline gap-2">
          <span className={value}>{inProgress.count}</span>
          <span className={unit}>séjour{inProgress.count > 1 ? "s" : ""}</span>
        </p>
        <p className="text-[13.5px] text-zinc-500 dark:text-zinc-400">
          {inProgress.occupied} bien{inProgress.occupied > 1 ? "s" : ""} occupé{inProgress.occupied > 1 ? "s" : ""} sur{" "}
          {inProgress.properties} biens meublés
        </p>
        <div
          role="progressbar"
          aria-label="Biens meublés occupés"
          aria-valuenow={occupied}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-auto h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10"
        >
          <div className="h-full rounded-full bg-brand-600 dark:bg-brand-400" style={{ width: `${occupied}%` }} />
        </div>
      </article>

      <article className={card}>
        <Heading icon="arrowRight" tile="bg-brand-100 text-brand-800 dark:bg-brand-800/60 dark:text-brand-100">
          Départs à venir
        </Heading>
        <p className="flex flex-wrap items-center gap-3">
          <span className="flex items-baseline gap-2">
            <span className={value}>{departures.count}</span>
            <span className={unit}>sous {departures.withinDays} jours</span>
          </span>
          {departures.count > 0 ? (
            <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-700 dark:bg-orange-950 dark:text-orange-300">
              Attention
            </span>
          ) : null}
        </p>
        <button
          type="button"
          onClick={onShowInProgress}
          disabled={inProgress.count === 0}
          className={cn(rowButton, "justify-between bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-brand-900/60 dark:text-brand-100 dark:hover:bg-brand-900")}
        >
          Voir les séjours en cours
          <Icon name="chevronRight" className="size-4" strokeWidth={2.4} />
        </button>
      </article>

      <article className={card}>
        <Heading icon="checkCircle" tile="bg-brand-50 text-brand-600 ring-1 ring-brand-200 ring-inset dark:bg-brand-900/60 dark:text-brand-100 dark:ring-brand-700">
          Séjours effectués
        </Heading>
        <p className="flex flex-wrap items-baseline gap-2">
          <span className={value}>{done.count}</span>
          <span className={unit}>séjour{done.count > 1 ? "s" : ""}</span>
        </p>
        <button
          type="button"
          onClick={onShowDone}
          className={cn(rowButton, "bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10")}
        >
          <Icon name="bed" className="size-4 text-brand-600 dark:text-brand-100" />
          <span className="flex-1">
            {done.nights} nuitée{done.nights > 1 ? "s" : ""} au total
          </span>
          <Icon name="chevronRight" className="size-4 text-zinc-500" strokeWidth={2.2} />
        </button>
      </article>
    </section>
  );
}

function Heading({ icon, tile, children }: { icon: IconName; tile: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3.5">
      <span className={cn("grid size-12 shrink-0 place-items-center rounded-2xl", tile)}>
        <Icon name={icon} className="size-5.5" strokeWidth={2} />
      </span>
      <h2 className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1 text-[15px] leading-snug font-semibold text-zinc-800 dark:text-zinc-100">
        {children}
      </h2>
    </div>
  );
}

/** Decorative trend of new reservations; the count carries the information. */
function Sparkline({ values }: { values: number[] }) {
  const id = useId();
  if (values.length < 2) return null;
  const width = 130;
  const height = 54;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const line = values
    .map((v, index) => {
      const x = 2 + (index / (values.length - 1)) * (width - 4);
      const y = 6 + (1 - (v - min) / span) * (height - 12);
      return `${index ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      className="pointer-events-none absolute top-[4.5rem] right-5 h-[54px] w-[130px] text-brand-500 dark:text-brand-300"
    >
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${width - 2},${height} L2,${height} Z`} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
