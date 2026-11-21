// Date helpers on ISO "YYYY-MM-DD" strings, computed in UTC so no time zone shifts the day.

const DAY = 86_400_000;

export function daysBetween(fromIso: string, toIso: string) {
  return Math.round((Date.parse(`${toIso}T00:00:00Z`) - Date.parse(`${fromIso}T00:00:00Z`)) / DAY);
}

/** True when `endDate` falls within `windowDays` from `asOf` (past dates are not "soon"). */
export function isEndingWithin(endDate: string, asOf: string, windowDays: number) {
  const days = daysBetween(asOf, endDate);
  return days >= 0 && days <= windowDays;
}
