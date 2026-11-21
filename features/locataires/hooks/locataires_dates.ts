import { isEndingWithin } from "@/lib/utils/dates";

export { daysBetween } from "@/lib/utils/dates";

/** Window for "fin de bail proche" and the renewals KPI. */
export const LEASE_END_WINDOW_DAYS = 60;

/** Lease ends within the window (already ended leases are not "proche"). */
export function isLeaseEndingSoon(endDate: string, asOf: string) {
  return isEndingWithin(endDate, asOf, LEASE_END_WINDOW_DAYS);
}
