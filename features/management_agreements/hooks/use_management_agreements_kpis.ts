import type { ManagementAgreement, ManagementAgreementKpis } from "../types";
import { monthlyCommission } from "./management_agreements_money";

/** Derives the four cards from the contracts, so they always match the table. */
export function computeManagementAgreementsKpis(
  agreements: ManagementAgreement[],
  activeHistory: number[],
): ManagementAgreementKpis {
  const active = agreements.filter((agreement) => agreement.status === "actif");
  const commissions = active.reduce((sum, agreement) => sum + monthlyCommission(agreement), 0);
  const rents = active.reduce((sum, agreement) => sum + agreement.monthlyRents, 0);
  return {
    active: { count: active.length, total: agreements.length, history: [...activeHistory, active.length] },
    commissions: { amount: commissions, rents, percentOfRents: rents === 0 ? 0 : (commissions / rents) * 100 },
    pending: { count: agreements.filter((agreement) => agreement.status === "en_attente").length },
    biens: { count: active.reduce((sum, agreement) => sum + agreement.biensCount, 0) },
  };
}

export function useManagementAgreementsKpis(agreements: ManagementAgreement[], activeHistory: number[]) {
  return computeManagementAgreementsKpis(agreements, activeHistory);
}
