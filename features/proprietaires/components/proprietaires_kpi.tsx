import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { formatCompactAmount } from "@/lib/utils/format";
import type { ProprietaireKpis } from "../types";
import { proprietairesPanel } from "./proprietaires_styles";

const card = cn(proprietairesPanel, "relative flex min-w-0 flex-col gap-4 overflow-hidden p-6 xl:p-5 2xl:p-6");
const value =
  "text-[40px] leading-none font-bold tracking-tight text-zinc-950 tabular-nums xl:text-[34px] 2xl:text-[40px] dark:text-zinc-50";
const unit = "text-lg text-zinc-600 dark:text-zinc-300";
const actionButton = cn(
  "mt-auto inline-flex w-full cursor-pointer items-center justify-between gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-colors",
  focusRing,
);

export type ProprietairesKpiProps = {
  kpis: ProprietaireKpis;
  /** "Lancer les virements": shows the owners waiting for their payout. */
  onShowToPay?: () => void;
  /** "Échéance sous N jours": shows the mandates ending soon. */
  onShowRenewals?: () => void;
};

export function ProprietairesKpi({ kpis, onShowToPay, onShowRenewals }: ProprietairesKpiProps) {
  const { owners, upToDate, toPay, renewals } = kpis;
  const rate = Math.round(upToDate.ratePercent);

  return (
    <section aria-label="Indicateurs propriétaires" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <article className={card}>
        <Heading tile="bg-brand-600 text-white dark:bg-brand-500" icon="users">
          Propriétaires
        </Heading>
        <p>
          <span className={value}>{owners.count}</span>{" "}
          <span className={unit}>bailleur{owners.count > 1 ? "s" : ""}</span>
        </p>
        <p className="relative z-10 mt-auto w-fit max-w-[55%] rounded-2xl bg-brand-50 px-3 py-1.5 text-sm leading-tight font-semibold text-brand-700 dark:bg-brand-900/60 dark:text-brand-100">
          {owners.biens} bien{owners.biens > 1 ? "s" : ""} sous mandat
        </p>
        <Sparkline values={owners.history} />
      </article>

      <article className={card}>
        <Heading tile="bg-brand-100 text-brand-800 dark:bg-brand-800/60 dark:text-brand-100" icon="checkCircle">
          Reversements à jour
        </Heading>
        <p>
          <span className={value}>{rate} %</span>{" "}
          <span className="text-base text-zinc-600 dark:text-zinc-300">
            {upToDate.count} sur {upToDate.total}
          </span>
        </p>
        <div
          role="progressbar"
          aria-label="Reversements à jour"
          aria-valuenow={rate}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-auto h-2.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10"
        >
          <div className="h-full rounded-full bg-brand-500" style={{ width: `${upToDate.ratePercent}%` }} />
        </div>
      </article>

      <article className={card}>
        <Heading tile="bg-brand-900 text-white dark:bg-brand-300 dark:text-brand-950" icon="clock">
          À reverser
        </Heading>
        <p className="flex flex-wrap items-center gap-3">
          <span className={value}>{formatCompactAmount(toPay.amount)}</span>
          {toPay.count > 0 ? (
            <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              {toPay.count} dossier{toPay.count > 1 ? "s" : ""}
            </span>
          ) : null}
        </p>
        <span className="sr-only">FCFA nets à reverser aux propriétaires</span>
        {toPay.count > 0 && onShowToPay ? (
          <button
            type="button"
            onClick={onShowToPay}
            className={cn(
              actionButton,
              "bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-brand-900/60 dark:text-brand-100 dark:hover:bg-brand-900",
            )}
          >
            Lancer les virements
            <Icon name="arrowRight" className="size-4" strokeWidth={2.2} />
          </button>
        ) : (
          <p className="mt-auto text-sm text-brand-700 dark:text-brand-100">Tous les reversements sont faits</p>
        )}
      </article>

      <article className={card}>
        <Heading tile="bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-200 dark:bg-brand-900/60 dark:text-brand-100 dark:ring-brand-700" icon="file">
          Mandats à renouveler
        </Heading>
        <p>
          <span className={value}>{renewals.count}</span>{" "}
          <span className={unit}>mandat{renewals.count > 1 ? "s" : ""}</span>
        </p>
        {onShowRenewals ? (
          <button
            type="button"
            onClick={onShowRenewals}
            disabled={renewals.count === 0}
            className={cn(
              actionButton,
              "bg-brand-50 text-brand-700 hover:bg-brand-100 disabled:cursor-default disabled:opacity-60 dark:bg-brand-900/60 dark:text-brand-100 dark:hover:bg-brand-900",
            )}
          >
            Échéance sous {renewals.withinDays} jours
            <Icon name="chevronRight" className="size-4" strokeWidth={2.2} />
          </button>
        ) : null}
      </article>
    </section>
  );
}

function Heading({ icon, tile, children }: { icon: IconName; tile: string; children: string }) {
  return (
    <div className="flex items-center gap-3.5">
      <span className={cn("grid size-12 shrink-0 place-items-center rounded-2xl shadow-sm", tile)}>
        <Icon name={icon} className="size-5.5" strokeWidth={2} />
      </span>
      <h2 className="flex-1 text-base leading-snug font-semibold text-zinc-800 xl:text-[15px] 2xl:text-base dark:text-zinc-100">
        {children}
      </h2>
    </div>
  );
}

/** Decorative trend; the count carries the information. */
function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const width = 160;
  const height = 56;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const line = values
    .map((v, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = 4 + (1 - (v - min) / span) * (height - 8);
      return `${index ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      preserveAspectRatio="none"
      className="pointer-events-none absolute right-5 bottom-6 h-14 w-[38%] text-brand-500 dark:text-brand-100"
    >
      <defs>
        <linearGradient id="proprietaires-sparkline-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${width},${height} L0,${height} Z`} fill="url(#proprietaires-sparkline-fill)" />
      <path d={line} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
