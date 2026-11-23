"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { formatAmount } from "@/lib/utils/format";
import type { ComptabiliteChartRange, ComptabiliteMonthPoint } from "../types";
import { monthLong, monthShort } from "./comptabilites_parts";
import { comptabilitesPanel, flowColors } from "./comptabilites_styles";

const ranges: { value: ComptabiliteChartRange; label: string }[] = [
  { value: 3, label: "3 derniers mois" },
  { value: 5, label: "5 derniers mois" },
  { value: 12, label: "12 derniers mois" },
];

/** Round the axis up to a whole step: 1 M below 10 M, 5 M above. */
function axisMax(value: number) {
  const step = value > 10_000_000 ? 5_000_000 : 1_000_000;
  return Math.max(step, Math.ceil(value / step) * step);
}

export type ComptabilitesOverviewChartProps = {
  series: ComptabiliteMonthPoint[];
  className?: string;
};

/** Income vs expenses per month, one shared axis. Hover or focus a month for its figures. */
export function ComptabilitesOverviewChart({ series, className }: ComptabilitesOverviewChartProps) {
  const [range, setRange] = useState<ComptabiliteChartRange>(5);
  const [activeMonth, setActiveMonth] = useState<string | null>(null);
  const months = series.slice(-range);
  const max = axisMax(Math.max(...months.flatMap((month) => [month.income, month.expenses])));
  const step = max > 10_000_000 ? 5_000_000 : 1_000_000;
  const ticks = Array.from({ length: max / step + 1 }, (_, index) => index * step);
  // The tooltip follows the pointer, and rests on the month in progress (as a headline).
  const activeIndex = Math.max(
    0,
    months.findIndex((month) => (activeMonth ? month.month === activeMonth : month.current)),
  );
  const active = months[activeIndex];

  return (
    <section aria-labelledby="comptabilites-overview-title" className={cn(comptabilitesPanel, "flex flex-col gap-5 p-6", className)}>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/60 dark:text-brand-100">
            <Icon name="calendar" className="size-5" />
          </span>
          <h2 id="comptabilites-overview-title" className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            Vue d&apos;ensemble financière
          </h2>
        </div>
        <div className="relative">
          <label htmlFor="comptabilites-range" className="sr-only">
            Période du graphique
          </label>
          <select
            id="comptabilites-range"
            value={range}
            onChange={(event) => {
              setRange(Number(event.target.value) as ComptabiliteChartRange);
              setActiveMonth(null);
            }}
            className={cn(
              "h-10 cursor-pointer appearance-none rounded-xl border border-zinc-200 bg-white pr-9 pl-3.5 text-sm font-medium text-zinc-700 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200",
              focusRing,
            )}
          >
            {ranges.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Icon name="chevronDown" className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-zinc-500" />
        </div>
      </header>

      <ul className="flex gap-5 text-sm text-zinc-700 dark:text-zinc-300">
        {(["recette", "depense"] as const).map((flow) => (
          <li key={flow} className="flex items-center gap-2">
            <span aria-hidden="true" className={cn("size-2.5 rounded-full", flowColors[flow].bg)} />
            {flowColors[flow].label}
          </li>
        ))}
      </ul>

      <div className="grid flex-1 grid-cols-[auto_minmax(0,1fr)] gap-x-3" aria-hidden="false">
        {/* Axis labels; the plot keeps the same height. */}
        <div className="relative h-60 w-8 text-right text-xs text-zinc-500 tabular-nums dark:text-zinc-400" aria-hidden="true">
          {ticks.map((tick) => (
            <span key={tick} className="absolute right-0 translate-y-1/2" style={{ bottom: `${(tick / max) * 100}%` }}>
              {tick / 1_000_000}M
            </span>
          ))}
        </div>

        <div className="relative h-60" onMouseLeave={() => setActiveMonth(null)}>
          {ticks.map((tick) => (
            <span
              key={tick}
              aria-hidden="true"
              className={cn("absolute inset-x-0 border-t", tick === 0 ? "border-zinc-300 dark:border-white/20" : "border-zinc-100 dark:border-white/5")}
              style={{ bottom: `${(tick / max) * 100}%` }}
            />
          ))}

          <div className="absolute inset-0 flex">
            {months.map((month) => {
              const isActive = month === active;
              return (
                <button
                  key={month.month}
                  type="button"
                  aria-label={`${monthLong(month.month)} : recettes ${formatAmount(month.income)} FCFA, dépenses ${formatAmount(month.expenses)} FCFA, solde ${formatAmount(month.balance)} FCFA`}
                  onMouseEnter={() => setActiveMonth(month.month)}
                  onFocus={() => setActiveMonth(month.month)}
                  onBlur={() => setActiveMonth(null)}
                  className={cn(
                    "group relative flex h-full flex-1 cursor-default items-end justify-center gap-0.5 rounded-xl outline-none",
                    isActive && "bg-brand-50/50 dark:bg-white/[0.03]",
                    "focus-visible:ring-2 focus-visible:ring-brand-500",
                  )}
                >
                  {(["income", "expenses"] as const).map((key) => (
                    <span
                      key={key}
                      className={cn(
                        "w-[30%] max-w-9 min-w-1.5 rounded-t-[4px] transition-opacity",
                        key === "income" ? flowColors.recette.bg : flowColors.depense.bg,
                        active && !isActive && "opacity-60",
                      )}
                      style={{ height: `${(month[key] / max) * 100}%` }}
                    />
                  ))}
                </button>
              );
            })}
          </div>

          {active ? (
            <div
              role="status"
              className="pointer-events-none absolute z-10 w-max max-w-56 rounded-2xl border border-zinc-100 bg-white px-3.5 py-2.5 text-sm shadow-lg dark:border-white/10 dark:bg-zinc-900"
              style={
                // Beside the month (right of it in the first half, left of it after), at the top of the plot.
                activeIndex < months.length / 2
                  ? { left: `calc(${((activeIndex + 1) / months.length) * 100}% + 6px)`, top: 0 }
                  : { right: `calc(${((months.length - activeIndex) / months.length) * 100}% + 6px)`, top: 0 }
              }
            >
              <p className="font-bold text-zinc-950 tabular-nums dark:text-zinc-50">{formatAmount(active.balance)} FCFA</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Solde {active.current ? "ce mois" : monthLong(active.month)}
              </p>
              <dl className="mt-1.5 grid grid-cols-[auto_auto] gap-x-3 gap-y-0.5 text-xs">
                {(["recette", "depense"] as const).map((flow) => (
                  <div key={flow} className="contents">
                    <dt className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300">
                      <span aria-hidden="true" className={cn("size-2 rounded-full", flowColors[flow].bg)} />
                      {flowColors[flow].label}
                    </dt>
                    <dd className="text-right font-semibold text-zinc-900 tabular-nums dark:text-zinc-100">
                      {formatAmount(flow === "recette" ? active.income : active.expenses)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </div>

        <span aria-hidden="true" />
        <div className="mt-2 flex text-xs font-medium text-zinc-600 dark:text-zinc-300" aria-hidden="true">
          {months.map((month, index) => (
            <span
              key={month.month}
              className={cn("flex-1 text-center", months.length > 6 && index % 2 === 1 && "max-sm:invisible", month === active && "text-brand-700 dark:text-brand-100")}
            >
              {monthShort(month.month)}
            </span>
          ))}
        </div>
      </div>

      {/* The same figures as a table, for screen readers. */}
      <table className="sr-only">
        <caption>Recettes et dépenses par mois (FCFA)</caption>
        <thead>
          <tr>
            <th scope="col">Mois</th>
            <th scope="col">Recettes</th>
            <th scope="col">Dépenses</th>
            <th scope="col">Solde</th>
          </tr>
        </thead>
        <tbody>
          {months.map((month) => (
            <tr key={month.month}>
              <th scope="row">{monthLong(month.month)}</th>
              <td>{formatAmount(month.income)}</td>
              <td>{formatAmount(month.expenses)}</td>
              <td>{formatAmount(month.balance)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
