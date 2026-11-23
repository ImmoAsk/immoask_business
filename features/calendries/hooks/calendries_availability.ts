import type { CalendrieAvailability, CalendriePeriod } from "../types";
import { isWithin, rangesOverlap } from "./calendries_dates";

export function periodsOf(periods: CalendriePeriod[], bienId: string) {
  return periods.filter((period) => period.bienId === bienId).sort((a, b) => a.start.localeCompare(b.start));
}

/** The period blocking a property on a day, if any. */
export function periodOn(periods: CalendriePeriod[], bienId: string, day: string) {
  return periods.find((period) => period.bienId === bienId && isWithin(day, period.start, period.end)) ?? null;
}

export function availabilityOn(periods: CalendriePeriod[], bienId: string, day: string): CalendrieAvailability {
  return periodOn(periods, bienId, day) ? "indisponible" : "disponible";
}

/** Existing periods of a property that overlap any of the ranges: what would cause a double booking. */
export function conflictsWith(periods: CalendriePeriod[], bienId: string, ranges: [string, string][]) {
  return periodsOf(periods, bienId).filter((period) =>
    ranges.some(([start, end]) => rangesOverlap(start, end, period.start, period.end)),
  );
}
