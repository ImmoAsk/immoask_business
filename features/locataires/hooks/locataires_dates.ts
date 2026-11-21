// Date helpers on ISO "YYYY-MM-DD" strings, computed in UTC so no time zone shifts the day.

const DAY = 86_400_000;

export function daysBetween(fromIso: string, toIso: string) {
  return Math.round((Date.parse(`${toIso}T00:00:00Z`) - Date.parse(`${fromIso}T00:00:00Z`)) / DAY);
}

/** Window for "fin de bail proche" and the renewals KPI. */
export const LEASE_END_WINDOW_DAYS = 60;

/** Lease ends within the window (already ended leases are not "proche"). */
export function isLeaseEndingSoon(endDate: string, asOf: string) {
  const days = daysBetween(asOf, endDate);
  return days >= 0 && days <= LEASE_END_WINDOW_DAYS;
}
