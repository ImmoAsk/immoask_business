import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import type { LocataireKpis } from "../types";
import { locatairesPanel } from "./locataires_styles";

const card = cn(locatairesPanel, "relative flex min-w-0 flex-col overflow-hidden p-6 xl:p-5 2xl:p-6");
const value = "text-[34px] leading-tight font-bold tracking-tight text-zinc-950 tabular-nums xl:text-[30px] 2xl:text-[34px] dark:text-zinc-50";
const deltaChip = "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-sm font-semibold";

export type LocatairesKpiProps = {
  kpis: LocataireKpis;
  /** Late card: shows the late tenants, each with a WhatsApp reminder. */
  onShowLate?: () => void;
  /** Renewals card: shows leases ending soon. */
  onShowRenewals?: () => void;
};

export function LocatairesKpi({ kpis, onShowLate, onShowRenewals }: LocatairesKpiProps) {
  const { active, upToDate, late, renewals } = kpis;
  const rate = Number(upToDate.ratePercent.toFixed(1));

  return (
    <section aria-label="Indicateurs locataires" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <article className={card}>
        <Heading tile="bg-brand-600 text-white dark:bg-brand-500" icon="users">
          Total Locataires
        </Heading>
        <p className="relative z-10 mt-4">
          <span className={value}>{active.count}</span>{" "}
          <span className="text-lg text-zinc-600 dark:text-zinc-300">actif{active.count > 1 ? "s" : ""}</span>
        </p>
        {active.delta !== null ? (
          <p className="relative z-10 mt-1 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
            <Delta value={active.delta} format={(v) => `${v}`} />
            vs mois dernier
          </p>
        ) : null}
        <Sparkline values={active.history} />
      </article>

      <article className={card}>
        <Heading tile="bg-emerald-500 text-white" icon="receipt">
          Loyers à jour
        </Heading>
        <p className="mt-4 flex flex-wrap items-center gap-3">
          <span className={value}>{rate}%</span>
          {upToDate.deltaPoints !== null ? (
            <Delta
              value={upToDate.deltaPoints}
              format={(v) => `${v.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} pts`}
            />
          ) : null}
        </p>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          {upToDate.count} locataire{upToDate.count > 1 ? "s" : ""} réglé{upToDate.count > 1 ? "s" : ""} / {upToDate.total}
        </p>
        <div
          role="progressbar"
          aria-label="Loyers à jour"
          aria-valuenow={rate}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-auto h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10"
        >
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${upToDate.ratePercent}%` }} />
        </div>
      </article>

      <article className={card}>
        <Heading tile="bg-amber-400 text-white dark:bg-amber-500" icon="clock">
          Retards de paiement
        </Heading>
        <p className="mt-4 flex flex-wrap items-center gap-3">
          <span className={value}>
            {late.count} <span className="text-2xl">dossier{late.count > 1 ? "s" : ""}</span>
          </span>
          {late.count > 0 ? (
            <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              Attention
            </span>
          ) : null}
        </p>
        {late.count > 0 && onShowLate ? (
          <button
            type="button"
            onClick={onShowLate}
            className={cn(
              "mt-auto inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-900",
              focusRing,
            )}
          >
            <Icon name="whatsapp" className="size-4.5" />
            Relancer via WhatsApp
          </button>
        ) : (
          <p className="mt-auto text-sm text-emerald-700 dark:text-emerald-300">Aucun retard ce mois-ci</p>
        )}
      </article>

      <article className={card}>
        <Heading tile="bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-300" icon="file">
          Baux à renouveler
        </Heading>
        <p className={cn(value, "mt-4")}>
          {renewals.count} <span className="text-2xl">contrat{renewals.count > 1 ? "s" : ""}</span>
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <p className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
            <Icon name="calendar" className="size-4 text-brand-600 dark:text-brand-100" />
            Échéance &lt; {renewals.withinDays} jours
          </p>
          {onShowRenewals ? (
            <button
              type="button"
              aria-label="Voir les baux à renouveler"
              onClick={onShowRenewals}
              className={cn(
                "grid size-8 cursor-pointer place-items-center rounded-full bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-brand-900/60 dark:text-brand-100",
                focusRing,
              )}
            >
              <Icon name="chevronRight" className="size-4" strokeWidth={2.2} />
            </button>
          ) : null}
        </div>
      </article>
    </section>
  );
}

function Heading({
  icon,
  tile,
  children,
}: {
  icon: "users" | "receipt" | "clock" | "file";
  tile: string;
  children: string;
}) {
  return (
    <div className="flex items-center gap-3.5">
      <span className={cn("grid size-11 shrink-0 place-items-center rounded-2xl", tile)}>
        <Icon name={icon} className="size-5" strokeWidth={2} />
      </span>
      <h2 className="flex-1 text-[15px] font-semibold text-zinc-800 xl:text-sm 2xl:text-[15px] dark:text-zinc-100">
        {children}
      </h2>
    </div>
  );
}

function Delta({ value: delta, format }: { value: number; format: (value: number) => string }) {
  const up = delta >= 0;
  return (
    <span
      className={cn(
        deltaChip,
        up
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
          : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
      )}
    >
      <Icon name="trendUp" className={cn("size-3.5", !up && "-scale-y-100")} />
      {up ? "+" : "−"}
      {format(Math.abs(delta))}
    </span>
  );
}

/** Decorative trend; the count and delta carry the information. */
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
      className="pointer-events-none absolute right-5 bottom-6 h-14 w-[42%] text-brand-500 dark:text-brand-100"
    >
      <defs>
        <linearGradient id="locataires-sparkline-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${width},${height} L0,${height} Z`} fill="url(#locataires-sparkline-fill)" />
      <path d={line} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
