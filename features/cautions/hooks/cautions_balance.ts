import { daysBetween } from "@/lib/utils/dates";
import type { Caution, CautionStatus } from "../types";

/** Taken for rent and not yet refilled, FCFA. */
export function usedAmount(caution: Caution) {
  return caution.movements.reduce((sum, movement) => sum + (movement.kind === "prelevement" ? movement.amount : -movement.amount), 0);
}

export function remainingAmount(caution: Caution) {
  return caution.amount - usedAmount(caution);
}

/** Share of the deposit still held, 0–100. */
export function remainingPercent(caution: Caution) {
  return caution.amount === 0 ? 0 : (remainingAmount(caution) / caution.amount) * 100;
}

export function cautionStatus(caution: Caution): CautionStatus {
  return usedAmount(caution) > 0 ? "modifiee" : "intacte";
}

/** Months of rent the deposit covers, for the segmented bar. */
export function monthSegments(caution: Caution) {
  return Math.max(1, Math.round(caution.amount / caution.agreement.monthlyRent));
}

/** Days since the deposit. */
export function depositAge(caution: Caution, asOf: string) {
  return Math.max(0, daysBetween(caution.depositedAt, asOf));
}

/** "Il y a 12 jours", "Il y a 10 mois" */
export function agoLabel(caution: Caution, asOf: string) {
  const days = depositAge(caution, asOf);
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  return days < 60 ? `Il y a ${days} jours` : `Il y a ${Math.round(days / 30)} mois`;
}

/** Below this share left, the "Niveau du coffre" filter flags a deposit. */
export const LOW_LEVEL_PERCENT = 50;
