import type { CalendrieBien, CalendrieKpis, CalendriePeriod } from "../types";
import { availabilityOn } from "./calendries_availability";
import { endOfMonth, rangesOverlap, startOfMonth } from "./calendries_dates";

/** Cards: availability today, and periods touching the month on screen. */
export function computeCalendriesKpis(
  biens: CalendrieBien[],
  periods: CalendriePeriod[],
  asOf: string,
  month: string,
): CalendrieKpis {
  const available = biens.filter((bien) => availabilityOn(periods, bien.id, asOf) === "disponible").length;
  const first = startOfMonth(month);
  const last = endOfMonth(month);
  return {
    total: biens.length,
    available,
    unavailable: biens.length - available,
    availablePercent: biens.length === 0 ? 0 : (available / biens.length) * 100,
    periodsInMonth: periods.filter((period) => rangesOverlap(period.start, period.end, first, last)).length,
  };
}

export function useCalendriesKpis(biens: CalendrieBien[], periods: CalendriePeriod[], asOf: string, month: string) {
  return computeCalendriesKpis(biens, periods, asOf, month);
}
