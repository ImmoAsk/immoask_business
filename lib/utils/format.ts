// Pure formatters (no React): safe in Server and Client Components.

const LOCALE = "fr-FR";

const numberFormat = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 });

/** 3840000 → "3 840 000" */
export function formatAmount(value: number) {
  return numberFormat.format(value);
}

/** 3840000 → "3,84 M", 192000 → "192 k" */
export function formatCompactAmount(value: number) {
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString(LOCALE, { maximumFractionDigits: 2 })} M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toLocaleString(LOCALE, { maximumFractionDigits: 0 })} k`;
  }
  return formatAmount(value);
}

/** 92.8 → "92.8%" (as written in the design). */
export function formatPercent(value: number, fractionDigits = 1) {
  return `${Number(value.toFixed(fractionDigits))}%`;
}

export const MONTHS_SHORT = [
  "Janv", "Févr", "Mars", "Avr", "Mai", "Juin",
  "Juil", "Août", "Sept", "Oct", "Nov", "Déc",
] as const;

export const MONTHS_LONG = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
] as const;

/** "2025-01" → { year: 2025, monthIndex: 0 } */
export function parseMonth(isoMonth: string) {
  const [year, month] = isoMonth.split("-").map(Number);
  return { year, monthIndex: month - 1 };
}

/** "2025-01" → "Janvier 2025" */
export function formatMonthLong(isoMonth: string) {
  const { year, monthIndex } = parseMonth(isoMonth);
  return `${MONTHS_LONG[monthIndex]} ${year}`;
}

/** "2025-02-05" → "05 Févr. 2025" (no time zone involved). */
export function formatDayMonthYear(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${String(day).padStart(2, "0")} ${MONTHS_SHORT[month - 1]}. ${year}`;
}
