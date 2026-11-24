import type { ManagementAgreement } from "../types";

/** Estimated monthly commission: only active contracts earn one. */
export function monthlyCommission(agreement: ManagementAgreement) {
  if (agreement.status !== "actif") return 0;
  return agreement.remuneration.mode === "pourcentage"
    ? Math.round((agreement.monthlyRents * agreement.remuneration.percent) / 100)
    : agreement.remuneration.amount;
}

/** Last day of the month after `asOf`: when a termination takes effect. */
export function terminationEffectiveDate(asOf: string) {
  const [year, month] = asOf.split("-").map(Number);
  const last = new Date(Date.UTC(year, month + 1, 0));
  return last.toISOString().slice(0, 10);
}
