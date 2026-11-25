import type { WorkspaceContract, WorkspacePeriod } from "../types";

const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

const pad = (value: number) => String(value).padStart(2, "0");

/** "2026-11" → the month as a period. */
export function monthPeriod(isoMonth: string): WorkspacePeriod {
  const [year, month] = isoMonth.split("-").map(Number);
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return {
    value: isoMonth,
    label: `${MONTHS[month - 1]} ${year}`,
    start: `${isoMonth}-01`,
    end: `${isoMonth}-${pad(lastDay)}`,
  };
}

/** Earliest signing date among the contracts, ISO "YYYY-MM-DD". */
export function firstContractDate(contracts: WorkspaceContract[]) {
  return contracts.reduce<string | null>((first, contract) => (first === null || contract.signedAt < first ? contract.signedAt : first), null);
}

/** Every month from `fromIso` to `toIso` included, most recent first. */
export function periodsBetween(fromIso: string, toIso: string): WorkspacePeriod[] {
  let [year, month] = fromIso.split("-").map(Number);
  const [lastYear, lastMonth] = toIso.split("-").map(Number);
  const periods: WorkspacePeriod[] = [];
  while (year < lastYear || (year === lastYear && month <= lastMonth)) {
    periods.push(monthPeriod(`${year}-${pad(month)}`));
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
  return periods.reverse();
}

/** Periods from the first management contract to `today`. */
export function workspacePeriods(contracts: WorkspaceContract[], today: string) {
  const first = firstContractDate(contracts);
  return first ? periodsBetween(first, today) : [];
}

/** Today in local time, ISO "YYYY-MM-DD". */
export function todayIso() {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}
