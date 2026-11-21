import type { Proprietaire } from "../types";

/** Rents collected minus the management fee: what the owner receives. */
export function netPayout(proprietaire: Proprietaire) {
  return Math.round(proprietaire.monthlyRevenue * (1 - proprietaire.mandate.feePercent / 100));
}

export function lotCount(proprietaire: Proprietaire) {
  return proprietaire.biens.reduce((sum, bien) => sum + bien.lots, 0);
}
