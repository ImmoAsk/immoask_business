import { daysBetween } from "@/lib/utils/dates";
import type { RentAgreement, RentAgreementStatus } from "../types";

/** Status from the dates and any termination, so it can never contradict them. */
export function agreementStatus(agreement: RentAgreement, asOf: string): RentAgreementStatus {
  if (agreement.termination) return "resilie";
  if (agreement.startDate > asOf) return "a_venir";
  if (agreement.endDate && agreement.endDate < asOf) return "termine";
  return "actif";
}

/** Deposit in FCFA: months × rent, or the flat amount. */
export function depositAmount(agreement: RentAgreement) {
  return agreement.deposit.mode === "mois" ? agreement.deposit.months * agreement.amount : agreement.deposit.amount;
}

/** Nights of a stay (0 for open-ended leases). */
export function stayNights(agreement: RentAgreement) {
  return agreement.endDate ? daysBetween(agreement.startDate, agreement.endDate) : 0;
}

/** Last day of the month after `asOf`: when a termination takes effect. */
export function terminationEffectiveDate(asOf: string) {
  const [year, month] = asOf.split("-").map(Number);
  return new Date(Date.UTC(year, month + 1, 0)).toISOString().slice(0, 10);
}

/** Window for the "À venir" card. */
export const UPCOMING_WINDOW_DAYS = 60;
