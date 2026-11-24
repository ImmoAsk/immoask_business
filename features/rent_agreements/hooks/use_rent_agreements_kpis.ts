import { daysBetween } from "@/lib/utils/dates";
import type { RentAgreement, RentAgreementKpis } from "../types";
import { agreementStatus, UPCOMING_WINDOW_DAYS } from "./rent_agreements_status";

/** Derives the four cards from the leases, so they always match the table. */
export function computeRentAgreementsKpis(agreements: RentAgreement[], asOf: string, activeHistory: number[]): RentAgreementKpis {
  const status = (agreement: RentAgreement) => agreementStatus(agreement, asOf);
  const active = agreements.filter((agreement) => status(agreement) === "actif");
  const live = agreements.filter((agreement) => ["actif", "a_venir"].includes(status(agreement)));
  // Monthly rents: stays have a total price, not a monthly one.
  const monthly = active.filter((agreement) => agreement.type !== "sejour");
  const amount = monthly.reduce((sum, agreement) => sum + agreement.amount, 0);
  const residential = monthly.filter((agreement) => agreement.type === "habitation").reduce((sum, agreement) => sum + agreement.amount, 0);

  return {
    active: { count: active.length, total: agreements.length, history: [...activeHistory, active.length] },
    rents: {
      amount,
      residentialPercent: amount === 0 ? 0 : (residential / amount) * 100,
      residentialCount: live.filter((agreement) => agreement.type === "habitation").length,
      commercialCount: live.filter((agreement) => agreement.type === "commercial").length,
    },
    depositsToReturn: { count: agreements.filter((agreement) => status(agreement) === "termine").length },
    upcoming: {
      count: agreements.filter(
        (agreement) => status(agreement) === "a_venir" && daysBetween(asOf, agreement.startDate) <= UPCOMING_WINDOW_DAYS,
      ).length,
      withinDays: UPCOMING_WINDOW_DAYS,
    },
  };
}

export function useRentAgreementsKpis(agreements: RentAgreement[], asOf: string, activeHistory: number[]) {
  return computeRentAgreementsKpis(agreements, asOf, activeHistory);
}
