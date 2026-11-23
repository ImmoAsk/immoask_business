// Day arithmetic on ISO "YYYY-MM-DD" strings, in UTC so no time zone shifts a day.

const DAY = 86_400_000;

const toTime = (iso: string) => Date.parse(`${iso}T00:00:00Z`);
const fromTime = (time: number) => new Date(time).toISOString().slice(0, 10);

export function addDays(iso: string, days: number) {
  return fromTime(toTime(iso) + days * DAY);
}

/** Days from `from` to `to` (negative when `to` is earlier). */
export function diffDays(from: string, to: string) {
  return Math.round((toTime(to) - toTime(from)) / DAY);
}

/** 0 = Monday … 6 = Sunday. */
export function weekdayIndex(iso: string) {
  return (new Date(toTime(iso)).getUTCDay() + 6) % 7;
}

export function startOfWeek(iso: string) {
  return addDays(iso, -weekdayIndex(iso));
}

export function startOfMonth(iso: string) {
  return `${iso.slice(0, 7)}-01`;
}

export function addMonths(iso: string, months: number) {
  const [year, month] = iso.split("-").map(Number);
  const index = year * 12 + (month - 1) + months;
  return `${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, "0")}-01`;
}

export function endOfMonth(iso: string) {
  return addDays(addMonths(iso, 1), -1);
}

/** The 6 Monday-first weeks shown for a month. */
export function monthWeeks(iso: string) {
  const first = startOfWeek(startOfMonth(iso));
  return Array.from({ length: 6 }, (_, week) => Array.from({ length: 7 }, (_, day) => addDays(first, week * 7 + day)));
}

export function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  return aStart <= bEnd && bStart <= aEnd;
}

export function isWithin(day: string, start: string, end: string) {
  return start <= day && day <= end;
}

/** Sorted days → runs of consecutive days: ["01","02","05"] → [["01","02"],["05","05"]]. */
export function consecutiveRuns(days: string[]) {
  const sorted = [...new Set(days)].sort();
  const runs: [string, string][] = [];
  for (const day of sorted) {
    const last = runs.at(-1);
    if (last && diffDays(last[1], day) === 1) last[1] = day;
    else runs.push([day, day]);
  }
  return runs;
}

const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const WEEKDAYS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

/** "2026-11-12" → "12/11/2026" */
export function formatDay(iso: string) {
  return iso.split("-").reverse().join("/");
}

/** "2026-11-05T14:32" → "05/11/2026 14:32" */
export function formatDateTime(isoDateTime: string) {
  return `${formatDay(isoDateTime.slice(0, 10))} ${isoDateTime.slice(11, 16)}`;
}

/** "2026-11-01" → "Novembre 2026" */
export function formatMonth(iso: string) {
  const text = `${MONTHS[Number(iso.slice(5, 7)) - 1]} ${iso.slice(0, 4)}`;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** "2026-11-12" → "jeudi 12 novembre 2026" */
export function formatLongDay(iso: string) {
  return `${WEEKDAYS[weekdayIndex(iso)]} ${Number(iso.slice(8, 10))} ${MONTHS[Number(iso.slice(5, 7)) - 1]} ${iso.slice(0, 4)}`;
}
