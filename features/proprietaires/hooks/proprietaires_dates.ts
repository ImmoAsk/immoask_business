import { isEndingWithin } from "@/lib/utils/dates";

/** Window for "fin de mandat proche" and the renewals KPI. */
export const MANDATE_END_WINDOW_DAYS = 60;

/** Mandate ends within the window (already ended mandates are not "proche"). */
export function isMandateEndingSoon(endDate: string, asOf: string) {
  return isEndingWithin(endDate, asOf, MANDATE_END_WINDOW_DAYS);
}
