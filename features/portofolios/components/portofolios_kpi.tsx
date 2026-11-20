import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { formatAmount } from "@/lib/utils/format";
import type { PortofolioKpis, PortofolioOccupancyLevel } from "../types";
import { portofolioPanel } from "./portofolios_styles";

const card = cn(portofolioPanel, "relative flex min-w-0 flex-col overflow-hidden p-6 xl:p-5 2xl:p-6");
const label = "text-[15px] xl:text-sm 2xl:text-[15px] font-semibold text-zinc-800 dark:text-zinc-100";
const linkClass = cn(
  "inline-flex items-center gap-1.5 rounded text-sm font-semibold text-brand-700 hover:underline dark:text-brand-100",
  focusRing,
);

const levels: Record<PortofolioOccupancyLevel, { label: string; className: string; bar: string }> = {
  optimal: {
    label: "Optimal",
    className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    bar: "bg-emerald-500",
  },
  correct: {
    label: "Correct",
    className: "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100",
    bar: "bg-brand-500",
  },
  faible: {
    label: "À surveiller",
    className: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    bar: "bg-amber-500",
  },
};

export type PortofoliosKpiProps = {
  kpis: PortofolioKpis;
  /** "Voir détails" on the availability card, e.g. filter the list on vacant properties. */
  onShowAvailable?: () => void;
};

export function PortofoliosKpi({ kpis, onShowAvailable }: PortofoliosKpiProps) {
  return (
    <section aria-label="Indicateurs du patrimoine" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <RevenueCard revenue={kpis.revenue} />
      <OccupancyCard occupancy={kpis.occupancy} />
      <AvailabilityCard available={kpis.availability.available} onShowAvailable={onShowAvailable} />
      <MaintenanceCard maintenance={kpis.maintenance} />
    </section>
  );
}

function CardHeading({ icon, tile, children }: { icon: ReactNode; tile: string; children: string }) {
  return (
    <div className="flex items-center gap-3.5">
      <span className={cn("grid size-11 shrink-0 place-items-center rounded-2xl", tile)}>{icon}</span>
      <h2 className={label}>{children}</h2>
    </div>
  );
}

function RevenueCard({ revenue }: { revenue: PortofolioKpis["revenue"] }) {
  const up = (revenue.deltaPercent ?? 0) >= 0;
  return (
    <article className={cn(card, "pb-0")}>
      <CardHeading
        tile="bg-brand-600 text-white dark:bg-brand-500"
        icon={<Icon name="home" className="size-5" strokeWidth={2} />}
      >
        Revenu locatif mensuel
      </CardHeading>
      <div className="relative mt-4 flex-1">
        <p className="relative z-10 text-[28px] xl:text-[23px] 2xl:text-[28px] leading-tight font-bold tracking-tight whitespace-nowrap text-zinc-950 tabular-nums dark:text-zinc-50">
          {formatAmount(revenue.amount)} <span className="text-xl xl:text-lg 2xl:text-xl">FCFA</span>
        </p>
        {revenue.deltaPercent !== null ? (
          <p
            className={cn(
              "relative z-10 mt-1 inline-flex items-center gap-1 text-sm font-semibold",
              up ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
            )}
          >
            <Icon name="trendUp" className={cn("size-4", !up && "-scale-y-100")} />
            {up ? "+" : ""}
            {revenue.deltaPercent.toLocaleString("fr-FR", { maximumFractionDigits: 1 })}% vs M-1
          </p>
        ) : null}
        <Sparkline values={revenue.history} />
      </div>
      <p className="-mx-6 xl:-mx-5 2xl:-mx-6 mt-3 flex items-center gap-2 border-t border-zinc-100 bg-zinc-50/70 px-6 xl:px-5 2xl:px-6 py-3 text-sm text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
        <Icon name="building" className="size-4 text-brand-600 dark:text-brand-100" />
        {revenue.activeUnits} unités actives
      </p>
    </article>
  );
}

/** Decorative trend line behind the revenue figure; the figure and delta carry the information. */
function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const width = 160;
  const height = 56;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const points = values.map((value, index) => [
    (index / (values.length - 1)) * width,
    4 + (1 - (value - min) / span) * (height - 8),
  ]);
  const line = points.map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      className="pointer-events-none absolute right-0 bottom-0 h-14 w-[46%] text-brand-500 dark:text-brand-100"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="portofolio-sparkline-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${width},${height} L0,${height} Z`} fill="url(#portofolio-sparkline-fill)" />
      <path d={line} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function OccupancyCard({ occupancy }: { occupancy: PortofolioKpis["occupancy"] }) {
  const level = levels[occupancy.level];
  const rate = Number(occupancy.ratePercent.toFixed(1));
  return (
    <article className={card}>
      <CardHeading tile="" icon={<OccupancyDonut ratePercent={occupancy.ratePercent} />}>
        Taux d&apos;occupation global
      </CardHeading>
      <p className="mt-4 flex flex-wrap items-center gap-3">
        <span className="text-[34px] xl:text-[30px] 2xl:text-[34px] leading-tight font-bold tracking-tight text-zinc-950 tabular-nums dark:text-zinc-50">
          {rate}%
        </span>
        <span className={cn("rounded-full px-3 py-1 text-sm font-semibold", level.className)}>{level.label}</span>
      </p>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
        {occupancy.occupied} lots occupés sur {occupancy.total}
      </p>
      <div
        role="progressbar"
        aria-label="Taux d'occupation"
        aria-valuenow={rate}
        aria-valuemin={0}
        aria-valuemax={100}
        className="mt-auto h-2 overflow-hidden rounded-full bg-zinc-100 pt-0 dark:bg-white/10"
      >
        <div className={cn("h-full rounded-full", level.bar)} style={{ width: `${occupancy.ratePercent}%` }} />
      </div>
    </article>
  );
}

function OccupancyDonut({ ratePercent }: { ratePercent: number }) {
  const radius = 9;
  const circumference = 2 * Math.PI * radius;
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-10 -rotate-90">
      <circle cx="12" cy="12" r={radius} fill="none" strokeWidth="6" className="stroke-emerald-100 dark:stroke-emerald-950" />
      <circle
        cx="12"
        cy="12"
        r={radius}
        fill="none"
        strokeWidth="6"
        strokeDasharray={`${(ratePercent / 100) * circumference} ${circumference}`}
        className="stroke-emerald-500"
      />
    </svg>
  );
}

function AvailabilityCard({ available, onShowAvailable }: { available: number; onShowAvailable?: () => void }) {
  return (
    <article className={card}>
      <CardHeading
        tile="bg-brand-50 text-brand-600 dark:bg-brand-900/60 dark:text-brand-100"
        icon={<Icon name="users" className="size-5" />}
      >
        Disponibles / Vacants
      </CardHeading>
      <p className="mt-4 text-[34px] xl:text-[30px] 2xl:text-[34px] leading-tight font-bold tracking-tight text-zinc-950 tabular-nums dark:text-zinc-50">
        {available} <span className="text-2xl">lot{available > 1 ? "s" : ""}</span>
      </p>
      <p className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
        disponible{available > 1 ? "s" : ""} à la location
      </p>
      {onShowAvailable ? (
        <button type="button" onClick={onShowAvailable} className={cn(linkClass, "mt-auto self-end pt-4")}>
          Voir détails <Icon name="arrowRight" className="size-4" />
        </button>
      ) : null}
    </article>
  );
}

function MaintenanceCard({ maintenance }: { maintenance: PortofolioKpis["maintenance"] }) {
  const days = maintenance.nextDeliveryInDays;
  return (
    <article className={card}>
      <CardHeading
        tile="bg-orange-50 text-orange-500 dark:bg-orange-950 dark:text-orange-300"
        icon={<Icon name="wrench" className="size-5" strokeWidth={2} />}
      >
        Maintenance & EDL
      </CardHeading>
      <p className="mt-4 text-[34px] xl:text-[30px] 2xl:text-[34px] leading-tight font-bold tracking-tight text-orange-600 tabular-nums dark:text-orange-400">
        {maintenance.count} <span className="text-2xl">en rénovation</span>
      </p>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
        {days === null
          ? "Aucune livraison planifiée"
          : `Livraison prévue dans ${days} jour${days > 1 ? "s" : ""}`}
      </p>
      <div className="mt-auto flex items-center gap-4 pt-4">
        {maintenance.progressPercent !== null ? (
          <div
            role="progressbar"
            aria-label="Avancement des travaux"
            aria-valuenow={maintenance.progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10"
          >
            <div className="h-full rounded-full bg-orange-500" style={{ width: `${maintenance.progressPercent}%` }} />
          </div>
        ) : (
          <span className="flex-1" />
        )}
        <Link href="/app/maintenances" className={linkClass}>
          Suivre <Icon name="arrowRight" className="size-4" />
        </Link>
      </div>
    </article>
  );
}
