import type { Versement, VersementKpis } from "../types";
import { VERSEMENT_TYPES } from "./versements_labels";

/** Derives the four cards from the payouts, so they always match the table. */
export function computeVersementsKpis(versements: Versement[], asOf: string, history: number[]): VersementKpis {
  const month = asOf.slice(0, 7);
  const total = versements.length;
  const sum = (currency: Versement["currency"]) =>
    versements.filter((versement) => versement.currency === currency).reduce((amount, versement) => amount + versement.amount, 0);
  const transfers = versements.filter((versement) => versement.method === "virement").length;
  const share = (count: number) => (total === 0 ? 0 : (count / total) * 100);

  return {
    total: { count: total, thisMonth: versements.filter((versement) => versement.date.startsWith(month)).length, month, history: [...history, total] },
    amounts: {
      fcfa: sum("FCFA"),
      others: (["EUR", "USD"] as const).map((currency) => ({ currency, amount: sum(currency) })).filter((entry) => entry.amount > 0),
    },
    transfers: { count: transfers, mobileMoney: total - transfers, percent: share(transfers) },
    byType: VERSEMENT_TYPES.map((type) => {
      const count = versements.filter((versement) => versement.type === type).length;
      return { type, count, percent: share(count) };
    }),
  };
}

export function useVersementsKpis(versements: Versement[], asOf: string, history: number[]) {
  return computeVersementsKpis(versements, asOf, history);
}
