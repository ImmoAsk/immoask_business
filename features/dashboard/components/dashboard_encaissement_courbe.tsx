"use client";

import { useId, useState, type KeyboardEvent, type PointerEvent } from "react";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { formatAmount, formatCompactAmount } from "@/lib/utils/format";
import { useElementWidth } from "../hooks/use_element_width";
import { useEncaissementSeries } from "../hooks/use_encaissement_series";
import type { DashboardEncaissementPeriod, DashboardEncaissementPoint } from "../types";
import { dashboardPanel } from "./dashboard_styles";

const HEIGHT = 260;
const PAD = { top: 40, right: 28, bottom: 36, left: 28 };

const periods: { value: DashboardEncaissementPeriod; label: string }[] = [
  { value: "mensuel", label: "Mensuel" },
  { value: "trimestre", label: "Trimestre" },
];

/** Monotone cubic path (Fritsch–Carlson): smooth, never overshoots the data. */
function monotonePath(xs: number[], ys: number[]) {
  const n = xs.length;
  if (n === 0) return "";
  if (n === 1) return `M${xs[0]},${ys[0]}`;

  const dx = xs.slice(1).map((x, i) => x - xs[i]);
  const m = ys.slice(1).map((y, i) => (y - ys[i]) / dx[i]);
  const t = xs.map((_, i) => {
    if (i === 0) return m[0];
    if (i === n - 1) return m[n - 2];
    return m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
  });
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) {
      t[i] = 0;
      t[i + 1] = 0;
      continue;
    }
    const a = t[i] / m[i];
    const b = t[i + 1] / m[i];
    const h = a * a + b * b;
    if (h > 9) {
      const tau = 3 / Math.sqrt(h);
      t[i] = tau * a * m[i];
      t[i + 1] = tau * b * m[i];
    }
  }

  let d = `M${xs[0]},${ys[0]}`;
  for (let i = 0; i < n - 1; i++) {
    const third = dx[i] / 3;
    d += ` C${xs[i] + third},${ys[i] + t[i] * third} ${xs[i + 1] - third},${ys[i + 1] - t[i + 1] * third} ${xs[i + 1]},${ys[i + 1]}`;
  }
  return d;
}

export type DashboardEncaissementCourbeProps = {
  points: DashboardEncaissementPoint[];
  className?: string;
};

export function DashboardEncaissementCourbe({ points, className }: DashboardEncaissementCourbeProps) {
  const { period, setPeriod, series } = useEncaissementSeries(points);
  const { ref, width } = useElementWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const gradientId = useId();
  const titleId = useId();

  const last = series.length - 1;
  const amounts = series.map((p) => p.amount);
  const max = amounts.length ? Math.max(...amounts) : 0;
  const min = amounts.length ? Math.min(...amounts) : 0;
  // Trend view: the axis starts below the lowest value (exact amounts are in the tooltip and table).
  const spread = Math.max(max - min, max * 0.05);
  const yMin = Math.max(0, min - spread * 0.6);
  const yMax = max + spread * 0.15;

  const plotW = Math.max(width - PAD.left - PAD.right, 0);
  const plotH = HEIGHT - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (series.length > 1 ? (i / (series.length - 1)) * plotW : plotW / 2);
  const y = (v: number) => PAD.top + plotH - ((v - yMin) / (yMax - yMin || 1)) * plotH;

  const xs = series.map((_, i) => x(i));
  const ys = series.map((p) => y(p.amount));
  const line = monotonePath(xs, ys);
  const baseline = PAD.top + plotH;
  const area = line ? `${line} L${xs[last]},${baseline} L${xs[0]},${baseline} Z` : "";
  const gridYs = [0, 1, 2].map((i) => PAD.top + (plotH / 2) * i);

  function nearestIndex(clientX: number, target: Element) {
    const left = target.getBoundingClientRect().left;
    const px = clientX - left;
    let best = 0;
    xs.forEach((value, i) => {
      if (Math.abs(value - px) < Math.abs(xs[best] - px)) best = i;
    });
    return best;
  }

  function onPointerMove(event: PointerEvent<SVGSVGElement>) {
    setActive(nearestIndex(event.clientX, event.currentTarget));
  }

  function onKeyDown(event: KeyboardEvent<SVGSVGElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const current = active ?? last;
    setActive(event.key === "ArrowLeft" ? Math.max(0, current - 1) : Math.min(last, current + 1));
  }

  const shown = active ?? null;
  const tooltipLeft = shown !== null ? Math.min(Math.max(xs[shown], 70), width - 70) : 0;

  return (
    <section aria-labelledby={titleId} className={cn(dashboardPanel, "p-6 sm:p-8", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 id={titleId} className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            Évolution des encaissements
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {period === "mensuel"
              ? `Suivi des loyers perçus sur les ${series.length} derniers mois`
              : `Loyers perçus sur les ${series.length} derniers trimestres complets`}
          </p>
        </div>
        <div role="group" aria-label="Période" className="inline-flex shrink-0 self-start rounded-full bg-zinc-100 p-1 dark:bg-white/10">
          {periods.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={period === option.value}
              onClick={() => {
                setPeriod(option.value);
                setActive(null);
              }}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm transition-colors",
                focusRing,
                period === option.value
                  ? "bg-white font-semibold text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-zinc-50"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div ref={ref} className="relative mt-6" style={{ height: HEIGHT }}>
        {width > 0 && series.length > 0 ? (
          <svg
            width={width}
            height={HEIGHT}
            role="img"
            aria-label="Courbe des encaissements. Flèches gauche et droite pour parcourir les valeurs."
            tabIndex={0}
            onPointerMove={onPointerMove}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive(last)}
            onBlur={() => setActive(null)}
            onKeyDown={onKeyDown}
            className={cn("block touch-pan-y rounded-xl", focusRing)}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity="0.16" />
                <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {gridYs.map((gy) => (
              <line
                key={gy}
                x1={PAD.left}
                x2={width - PAD.right}
                y1={gy}
                y2={gy}
                className="stroke-zinc-100 dark:stroke-white/10"
                strokeWidth={1}
              />
            ))}

            <path d={area} fill={`url(#${gradientId})`} />
            <path
              d={line}
              fill="none"
              stroke="var(--color-brand-600)"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {shown !== null ? (
              <line
                x1={xs[shown]}
                x2={xs[shown]}
                y1={PAD.top - 8}
                y2={baseline}
                className="stroke-zinc-300 dark:stroke-white/25"
                strokeDasharray="3 4"
              />
            ) : null}

            {series.map((point, i) => {
              const highlighted = i === shown || (shown === null && i === last);
              return (
                <circle
                  key={point.key}
                  cx={xs[i]}
                  cy={ys[i]}
                  r={highlighted ? 6.5 : 4}
                  fill="var(--color-brand-600)"
                  className="stroke-white dark:stroke-zinc-950"
                  strokeWidth={2}
                />
              );
            })}

            {shown === null ? (
              <text
                x={xs[last]}
                y={ys[last] - 16}
                textAnchor="middle"
                className="fill-brand-700 text-[13px] font-semibold dark:fill-brand-100"
              >
                {formatCompactAmount(series[last].amount)}
              </text>
            ) : null}

            {series.map((point, i) => (
              <text
                key={point.key}
                x={xs[i]}
                y={HEIGHT - 8}
                textAnchor="middle"
                className={cn(
                  "text-[13px]",
                  i === (shown ?? last)
                    ? "fill-brand-700 font-semibold dark:fill-brand-100"
                    : "fill-zinc-400 dark:fill-zinc-500",
                )}
              >
                {point.label}
              </text>
            ))}
          </svg>
        ) : null}

        {shown !== null ? (
          <div
            role="status"
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-xl bg-zinc-950 px-3 py-2 text-center text-white shadow-lg dark:bg-white dark:text-zinc-950"
            style={{ left: tooltipLeft, top: ys[shown] - 14 }}
          >
            <p className="text-xs whitespace-nowrap opacity-75">{series[shown].longLabel}</p>
            <p className="text-sm font-semibold whitespace-nowrap tabular-nums">
              {formatAmount(series[shown].amount)} FCFA
            </p>
          </div>
        ) : null}
      </div>

      <table className="sr-only">
        <caption>Loyers perçus par {period === "mensuel" ? "mois" : "trimestre"}</caption>
        <thead>
          <tr>
            <th scope="col">Période</th>
            <th scope="col">Montant (FCFA)</th>
          </tr>
        </thead>
        <tbody>
          {series.map((point) => (
            <tr key={point.key}>
              <th scope="row">{point.longLabel}</th>
              <td>{formatAmount(point.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
