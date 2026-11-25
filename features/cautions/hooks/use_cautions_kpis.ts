import type { Caution, CautionKpis } from "../types";
import { cautionStatus, remainingAmount, usedAmount } from "./cautions_balance";

/** Derives the four cards from the deposits, so they always match the table. */
export function computeCautionsKpis(cautions: Caution[], heldHistory: number[]): CautionKpis {
  const held = cautions.reduce((sum, caution) => sum + remainingAmount(caution), 0);
  const intact = cautions.filter((caution) => cautionStatus(caution) === "intacte").length;
  return {
    held: { amount: held, count: cautions.length, history: [...heldHistory, held] },
    intact: { count: intact, total: cautions.length, percent: cautions.length === 0 ? 0 : (intact / cautions.length) * 100 },
    modified: { count: cautions.length - intact },
    used: { amount: cautions.reduce((sum, caution) => sum + usedAmount(caution), 0) },
  };
}

export function useCautionsKpis(cautions: Caution[], heldHistory: number[]) {
  return computeCautionsKpis(cautions, heldHistory);
}
