import type { CalendrierBien, CalendrierKpis, CalendrierPeriod } from "../types";
import { availabilityOn } from "./calendriers_availability";
import { endOfMonth, rangesOverlap, startOfMonth } from "./calendriers_dates";

/** Cards: availability today, and periods touching the month on screen. */
export function computeCalendriersKpis(
  biens: CalendrierBien[],
  periods: CalendrierPeriod[],
  asOf: string,
  month: string,
): CalendrierKpis {
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

export function useCalendriersKpis(biens: CalendrierBien[], periods: CalendrierPeriod[], asOf: string, month: string) {
  return computeCalendriersKpis(biens, periods, asOf, month);
}
