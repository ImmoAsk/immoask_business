"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { formatAmount, formatCompactAmount } from "@/lib/utils/format";
import type { ComptabiliteBreakdownSlice } from "../types";
import { comptabilitesPanel } from "./comptabilites_styles";

// Slice colours in fixed order (never by rank), from the validated chart-part-* tokens.
const partStroke = ["stroke-chart-part-1", "stroke-chart-part-2", "stroke-chart-part-3"];
const partFill = ["bg-chart-part-1", "bg-chart-part-2", "bg-chart-part-3"];

const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
/** Surface gap between slices, in SVG units. */
const GAP = 2.5;

export type ComptabilitesBreakdownProps = {
  title: string;
  total: number;
  slices: ComptabiliteBreakdownSlice[];
  className?: string;
};

/** Donut of a total by category, with a legend carrying names, shares and amounts. */
export function ComptabilitesBreakdown({ title, total, slices, className }: ComptabilitesBreakdownProps) {
  const id = useId();
  const [hovered, setHovered] = useState<number | null>(null);
  const focused = hovered !== null ? slices[hovered] : null;
  const visible = slices.filter((slice) => slice.amount > 0).length;
  const lengths = slices.map((slice) => (total === 0 ? 0 : (slice.amount / total) * CIRCUMFERENCE));
  const starts = lengths.map((_, index) => lengths.slice(0, index).reduce((a, b) => a + b, 0));

  return (
    <section aria-labelledby={`${id}-title`} className={cn(comptabilitesPanel, "flex flex-col gap-5 p-6", className)}>
      <h2 id={`${id}-title`} className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
        {title}
      </h2>

      <div className="relative mx-auto size-44">
        <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
          <defs>
            {/* Dark mode has no third distinguishable blue: the third slice is hatched instead. */}
            <pattern id={`${id}-hatch`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="5" height="5" className="fill-chart-part-3 opacity-30" />
              <line x1="0" y1="0" x2="0" y2="5" strokeWidth="2.5" className="stroke-chart-part-3" />
            </pattern>
          </defs>
          <circle cx="60" cy="60" r={RADIUS} fill="none" strokeWidth="16" className="stroke-zinc-100 dark:stroke-white/5" />
          {slices.map((slice, index) => {
            const dash = Math.max(0, lengths[index] - (visible > 1 ? GAP : 0));
            const start = starts[index];
            if (slice.amount === 0) return null;
            const common = {
              cx: 60,
              cy: 60,
              r: RADIUS,
              fill: "none",
              strokeWidth: hovered === index ? 19 : 16,
              strokeDasharray: `${dash} ${CIRCUMFERENCE}`,
              strokeDashoffset: -start,
              onMouseEnter: () => setHovered(index),
              onMouseLeave: () => setHovered(null),
            };
            const dim = hovered !== null && hovered !== index ? "opacity-45" : "";
            return index === 2 ? (
              <g key={slice.category} className={cn("transition-opacity", dim)}>
                <circle {...common} className="stroke-chart-part-3 dark:hidden" />
                <circle {...common} stroke={`url(#${id}-hatch)`} className="hidden dark:inline" />
              </g>
            ) : (
              <circle key={slice.category} {...common} className={cn(partStroke[index], "transition-opacity", dim)} />
            );
          })}
        </svg>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-2xl leading-tight font-bold tracking-tight text-zinc-950 tabular-nums dark:text-zinc-50">
              {formatCompactAmount(focused ? focused.amount : total)}
            </p>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{focused ? focused.label : "FCFA"}</p>
          </div>
        </div>
      </div>

      <ul className="mt-auto flex flex-col gap-1">
        {slices.map((slice, index) => (
          <li key={slice.category}>
            <button
              type="button"
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(index)}
              onBlur={() => setHovered(null)}
              aria-label={`${slice.label} : ${slice.percent} %, ${formatAmount(slice.amount)} FCFA`}
              className={cn(
                "flex w-full cursor-default items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                hovered === index && "bg-zinc-50 dark:bg-white/5",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "size-3 shrink-0 rounded-full",
                  partFill[index],
                  index === 2 && "dark:bg-transparent dark:bg-[repeating-linear-gradient(45deg,var(--chart-part-3)_0_2px,transparent_2px_4px)] dark:ring-1 dark:ring-chart-part-3",
                )}
              />
              <span className="flex-1 truncate text-left text-zinc-700 dark:text-zinc-300">{slice.label}</span>
              <span className="text-xs text-zinc-500 tabular-nums dark:text-zinc-400">{formatAmount(slice.amount)}</span>
              <span className="w-10 text-right font-semibold text-zinc-950 tabular-nums dark:text-zinc-50">{slice.percent} %</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
