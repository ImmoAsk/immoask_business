import type { Locataire, LocataireKpis } from "../types";
import { isLeaseEndingSoon, LEASE_END_WINDOW_DAYS } from "./locataires_dates";

/** Derives the four cards from the tenants, so they always match the list. */
export function computeLocatairesKpis(
  locataires: Locataire[],
  asOf: string,
  activeHistory: number[],
  upToDateRateHistory: number[],
): LocataireKpis {
  const total = locataires.length;
  const upToDate = locataires.filter((locataire) => locataire.payment.status === "a_jour").length;
  const ratePercent = total === 0 ? 0 : (upToDate / total) * 100;
  const previousActive = activeHistory.at(-1);
  const previousRate = upToDateRateHistory.at(-1);

  return {
    active: {
      count: total,
      delta: previousActive === undefined ? null : total - previousActive,
      history: [...activeHistory, total],
    },
    upToDate: {
      count: upToDate,
      total,
      ratePercent,
      deltaPoints: previousRate === undefined ? null : ratePercent - previousRate,
    },
    late: { count: total - upToDate },
    renewals: {
      count: locataires.filter((locataire) => isLeaseEndingSoon(locataire.lease.endDate, asOf)).length,
      withinDays: LEASE_END_WINDOW_DAYS,
    },
  };
}

export function useLocatairesKpis(
  locataires: Locataire[],
  asOf: string,
  activeHistory: number[],
  upToDateRateHistory: number[],
) {
  return computeLocatairesKpis(locataires, asOf, activeHistory, upToDateRateHistory);
}
