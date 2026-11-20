"use client";

import { useState } from "react";
import { MONTHS_LONG, MONTHS_SHORT, parseMonth } from "@/lib/utils/format";
import type {
  DashboardEncaissementPeriod,
  DashboardEncaissementPoint,
  DashboardEncaissementSeriesPoint,
} from "../types";

const MONTHS_SHOWN = 6;
const QUARTERS_SHOWN = 4;

export function toMonthlySeries(points: DashboardEncaissementPoint[]): DashboardEncaissementSeriesPoint[] {
  return points.slice(-MONTHS_SHOWN).map(({ month, amount }) => {
    const { year, monthIndex } = parseMonth(month);
    return {
      key: month,
      label: MONTHS_SHORT[monthIndex],
      longLabel: `${MONTHS_LONG[monthIndex]} ${year}`,
      amount,
    };
  });
}

export function toQuarterlySeries(points: DashboardEncaissementPoint[]): DashboardEncaissementSeriesPoint[] {
  const quarters = new Map<string, { year: number; quarter: number; amount: number; months: number }>();
  for (const { month, amount } of points) {
    const { year, monthIndex } = parseMonth(month);
    const quarter = Math.floor(monthIndex / 3) + 1;
    const key = `${year}-T${quarter}`;
    const entry = quarters.get(key) ?? { year, quarter, amount: 0, months: 0 };
    entry.amount += amount;
    entry.months += 1;
    quarters.set(key, entry);
  }

  // A quarter still running (or missing months) would read as a sharp drop: keep complete quarters only.
  return [...quarters.entries()]
    .filter(([, entry]) => entry.months === 3)
    .slice(-QUARTERS_SHOWN)
    .map(([key, { year, quarter, amount }]) => ({
      key,
      label: `T${quarter} ${String(year).slice(2)}`,
      longLabel: `T${quarter} ${year}`,
      amount,
    }));
}

/** Chart series for the selected period, with the period toggle state. */
export function useEncaissementSeries(
  points: DashboardEncaissementPoint[],
  initialPeriod: DashboardEncaissementPeriod = "mensuel",
) {
  const [period, setPeriod] = useState<DashboardEncaissementPeriod>(initialPeriod);
  const series = period === "mensuel" ? toMonthlySeries(points) : toQuarterlySeries(points);
  return { period, setPeriod, series };
}
