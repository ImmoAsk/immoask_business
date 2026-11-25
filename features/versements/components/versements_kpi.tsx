import { useId } from "react";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatMonthYear } from "@/lib/utils/dates";
import { formatAmount } from "@/lib/utils/format";
import { TYPE_PLURALS } from "../hooks/versements_labels";
import type { VersementKpis } from "../types";
import { typeStyles, versementsPanel } from "./versements_styles";

const card = cn(versementsPanel, "relative flex min-w-0 flex-col gap-3.5 overflow-hidden p-6 xl:p-5 2xl:p-6");
const value = "text-[38px] leading-none font-bold tracking-tight text-zinc-950 tabular-nums xl:text-[32px] 2xl:text-[38px] dark:text-zinc-50";
const unit = "text-[15px] font-semibold text-zinc-500 dark:text-zinc-400";
const chip = "inline-flex rounded-xl bg-brand-50 px-3 py-1.5 text-[13px] font-semibold text-brand-800 dark:bg-brand-900/60 dark:text-brand-100";

export type VersementsKpiProps = { kpis: VersementKpis };

export function VersementsKpi({ kpis }: VersementsKpiProps) {
  const { total, amounts, transfers, byType } = kpis;
  const transferPercent = Math.round(transfers.percent);

  return (
    <section aria-label="Indicateurs des versements" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <article className={card}>
        <Sparkline values={total.history} />
        <Heading icon="bank" tile="bg-brand-600 text-white shadow-[0_8px_18px_-6px_rgba(10,116,174,0.6)] dark:bg-brand-500">
          Versements effectués
        </Heading>
        <p className="flex flex-wrap items-baseline gap-2">
          <span className={value}>{total.count}</span>
          <span className={unit}>versement{total.count > 1 ? "s" : ""}</span>
        </p>
        <p className="mt-auto">
          <span className={chip}>
            {total.thisMonth} en {formatMonthYear(total.month)}
          </span>
        </p>
      </article>

      <article className={card}>
        <Heading icon="cash" tile="bg-brand-900 text-white dark:bg-brand-300 dark:text-brand-950">
          Total versé en FCFA
        </Heading>
        <p className="flex flex-wrap items-baseline gap-2">
          <span className={value}>{formatAmount(amounts.fcfa)}</span>
          <span className={unit}>FCFA</span>
        </p>
        {amounts.others.length > 0 ? (
          <p className="mt-auto flex flex-wrap gap-2">
            {amounts.others.map((other) => (
              <span key={other.currency} className={cn(chip, "text-[12.5px] tabular-nums")}>
                + {formatAmount(other.amount)} {other.currency}
              </span>
            ))}
          </p>
        ) : null}
      </article>

      <article className={card}>
        <Heading icon="arrowRight" tile="bg-brand-100 text-brand-800 dark:bg-brand-800/60 dark:text-brand-100">
          Part des virements
          <span className="ml-auto shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold whitespace-nowrap text-brand-700 dark:bg-brand-900/60 dark:text-brand-100">
            {transferPercent} %
          </span>
        </Heading>
        <p className="flex flex-wrap items-baseline gap-2">
          <span className={value}>{transfers.count}</span>
          <span className={unit}>virement{transfers.count > 1 ? "s" : ""}</span>
        </p>
        <p className="text-[13.5px] text-zinc-500 dark:text-zinc-400">
          {transfers.mobileMoney} versement{transfers.mobileMoney > 1 ? "s" : ""} par Mobile Money
        </p>
        <div
          role="progressbar"
          aria-label="Part des virements"
          aria-valuenow={transferPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-auto h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10"
        >
          <div className="h-full rounded-full bg-brand-600 dark:bg-brand-400" style={{ width: `${transferPercent}%` }} />
        </div>
      </article>

      <article className={card}>
        <Heading icon="pieChart" tile="bg-brand-50 text-brand-600 ring-1 ring-brand-200 ring-inset dark:bg-brand-900/60 dark:text-brand-100 dark:ring-brand-700">
          Par type de dépôt
        </Heading>
        <ul className="mt-auto flex flex-col gap-2.5">
          {byType.map((entry) => (
            <li key={entry.type} className="flex items-center gap-2.5">
              <span className="w-[4.75rem] shrink-0 text-[13px] font-semibold text-zinc-800 dark:text-zinc-100">{TYPE_PLURALS[entry.type]}</span>
              <span
                role="progressbar"
                aria-label={`Part des ${TYPE_PLURALS[entry.type].toLowerCase()}`}
                aria-valuenow={Math.round(entry.percent)}
                aria-valuemin={0}
                aria-valuemax={100}
                className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10"
              >
                <span className={cn("block h-full rounded-full", typeStyles[entry.type].bar)} style={{ width: `${entry.percent}%` }} />
              </span>
              <span className="w-6 shrink-0 text-right text-[13px] font-bold text-zinc-900 tabular-nums dark:text-zinc-100">{entry.count}</span>
            </li>
          ))}
        </ul>
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

/** Decorative trend of payouts on record; the count carries the information. Narrow, to clear the "versements" unit, and hidden where four cards share 1280–1536px. */
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
      preserveAspectRatio="none"
      className="pointer-events-none absolute top-[4.5rem] right-5 h-[54px] w-24 text-brand-500 xl:hidden 2xl:block dark:text-brand-300"
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
