import { useId } from "react";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatAmount } from "@/lib/utils/format";
import type { ComptabiliteKpis, ComptabiliteTrend } from "../types";
import { comptabilitesPanel } from "./comptabilites_styles";

const card = cn(comptabilitesPanel, "relative flex min-w-0 flex-col gap-4 overflow-hidden p-6 xl:p-5 2xl:p-6");

export type ComptabilitesKpiProps = { kpis: ComptabiliteKpis };

export function ComptabilitesKpi({ kpis }: ComptabilitesKpiProps) {
  const { income, expenses, balance, ledger } = kpis;
  return (
    <section aria-label="Indicateurs comptables" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <TrendCard title="Revenus locatifs" icon="trendUp" tile="bg-brand-600 text-white dark:bg-brand-500" trend={income} goodWhenUp line="text-chart-income" />
      <TrendCard title="Dépenses" icon="wallet" tile="bg-brand-100 text-brand-800 dark:bg-brand-800/60 dark:text-brand-100" trend={expenses} goodWhenUp={false} line="text-chart-expense" />
      <TrendCard title="Solde du mois" icon="bank" tile="bg-brand-900 text-white dark:bg-brand-300 dark:text-brand-950" trend={balance} goodWhenUp line="text-brand-500" />

      <article className={cn(card, ledger.balanced && "bg-linear-to-br from-white to-brand-50/80 dark:from-zinc-950 dark:to-brand-950/60")}>
        <Heading icon={ledger.balanced ? "checkCircle" : "alert"} tile={ledger.balanced ? "bg-brand-600 text-white dark:bg-brand-500" : "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300"}>
          Équilibre comptable
        </Heading>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-2xl leading-tight font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              {ledger.balanced ? "Actifs = Passifs" : "Écart détecté"}
            </p>
            <p className="mt-1 text-sm font-medium text-zinc-600 tabular-nums dark:text-zinc-300">
              {ledger.balanced
                ? `${formatAmount(ledger.assets)} FCFA`
                : `${formatAmount(Math.abs(ledger.assets - ledger.liabilities))} FCFA à justifier`}
            </p>
          </div>
          {ledger.balanced ? (
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600 ring-4 ring-brand-50/60 dark:bg-brand-900/60 dark:text-brand-100 dark:ring-brand-900/30">
              <Icon name="checkCircle" className="size-6" strokeWidth={2} />
            </span>
          ) : null}
        </div>
        <p className="mt-auto text-xs text-zinc-500 dark:text-zinc-400">
          Actifs {formatAmount(ledger.assets)} · Passifs {formatAmount(ledger.liabilities)}
        </p>
      </article>
    </section>
  );
}

function TrendCard({
  title,
  icon,
  tile,
  trend,
  goodWhenUp,
  line,
}: {
  title: string;
  icon: IconName;
  tile: string;
  trend: ComptabiliteTrend;
  goodWhenUp: boolean;
  line: string;
}) {
  const delta = trend.deltaPercent;
  const up = (delta ?? 0) >= 0;
  const good = up === goodWhenUp;
  return (
    <article className={card}>
      <Heading icon={icon} tile={tile}>
        {title}
      </Heading>
      <div className="mt-auto grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
        <div className="min-w-0">
          <p className="flex flex-wrap items-baseline gap-x-1.5">
            <span className="text-[28px] leading-none font-bold tracking-tight whitespace-nowrap text-zinc-950 tabular-nums xl:text-[24px] 2xl:text-[28px] dark:text-zinc-50">
              {formatAmount(trend.amount)}
            </span>
            <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">FCFA</span>
          </p>
          {delta !== null ? (
            <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-600 dark:text-zinc-300">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[13px] font-semibold whitespace-nowrap",
                  good
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100"
                    : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
                )}
              >
                <Icon name="trendUp" className={cn("size-3.5", !up && "-scale-y-100")} />
                {up ? "+" : "−"}
                {Math.abs(delta).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %
              </span>
              <span className="whitespace-nowrap">vs mois dernier</span>
            </p>
          ) : null}
        </div>
        <Sparkline values={trend.history.slice(-6)} className={line} />
      </div>
    </article>
  );
}

function Heading({ icon, tile, children }: { icon: IconName; tile: string; children: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className={cn("grid size-11 shrink-0 place-items-center rounded-2xl", tile)}>
        <Icon name={icon} className="size-5" strokeWidth={2} />
      </span>
      <h2 className="text-[15px] leading-snug font-semibold text-zinc-700 dark:text-zinc-200">{children}</h2>
    </div>
  );
}

/** Decorative trend of the last months; the amount and delta carry the information. */
function Sparkline({ values, className }: { values: number[]; className: string }) {
  const id = useId();
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
      className={cn("pointer-events-none h-12 w-20 shrink-0 2xl:w-24", className)}
    >
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${width},${height} L0,${height} Z`} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
