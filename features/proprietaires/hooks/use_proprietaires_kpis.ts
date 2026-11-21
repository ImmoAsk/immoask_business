import type { Proprietaire, ProprietaireKpis } from "../types";
import { isMandateEndingSoon, MANDATE_END_WINDOW_DAYS } from "./proprietaires_dates";
import { netPayout } from "./proprietaires_money";

/** Derives the four cards from the owners, so they always match the list. */
export function computeProprietairesKpis(
  proprietaires: Proprietaire[],
  asOf: string,
  ownersHistory: number[],
): ProprietaireKpis {
  const total = proprietaires.length;
  const waiting = proprietaires.filter((proprietaire) => proprietaire.reversement.status === "en_attente");
  const upToDate = total - waiting.length;

  return {
    owners: {
      count: total,
      biens: proprietaires.reduce((sum, proprietaire) => sum + proprietaire.biens.length, 0),
      history: [...ownersHistory, total],
    },
    upToDate: { count: upToDate, total, ratePercent: total === 0 ? 0 : (upToDate / total) * 100 },
    toPay: {
      amount: waiting.reduce((sum, proprietaire) => sum + netPayout(proprietaire), 0),
      count: waiting.length,
    },
    renewals: {
      count: proprietaires.filter((proprietaire) => isMandateEndingSoon(proprietaire.mandate.endDate, asOf)).length,
      withinDays: MANDATE_END_WINDOW_DAYS,
    },
  };
}

export function useProprietairesKpis(proprietaires: Proprietaire[], asOf: string, ownersHistory: number[]) {
  return computeProprietairesKpis(proprietaires, asOf, ownersHistory);
}
