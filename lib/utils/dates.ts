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

const MONTHS_FR = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

/** "2025-01-08" → "08 janv. 2025" */
export function formatShortDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${String(day).padStart(2, "0")} ${MONTHS_FR[month - 1]} ${year}`;
}

/** "2025-01" → "janvier 2025" */
export function formatMonthYear(isoMonth: string) {
  const [year, month] = isoMonth.split("-").map(Number);
  const names = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  return `${names[month - 1]} ${year}`;
}
