"use client";

import { useWorkspaceScope } from "@/features/workspace/hooks";
import type { ComptabiliteMonthTotals, ComptabilitesBooks, ComptabilitesData } from "../types";

/**
 * The books of the header's management contract, or every contract's added up.
 * Operations, closed months and the balance sheet all follow the same contract, so the cards, charts and table agree.
 */
export function useComptabilitesInScope(data: ComptabilitesData): ComptabilitesBooks {
  const scope = useWorkspaceScope();
  const inScope = (reference: string) => scope.matchesContract(reference);

  // Every closed month stays in the series, at zero for a contract not yet signed or already ended,
  // so "vs mois dernier" always compares with the month just before.
  const months = new Map<string, ComptabiliteMonthTotals>();
  for (const entry of data.history) {
    if (!months.has(entry.month)) months.set(entry.month, { month: entry.month, income: 0, expenses: 0 });
  }
  for (const entry of data.history) {
    if (!inScope(entry.management)) continue;
    const month = months.get(entry.month)!;
    month.income += entry.income;
    month.expenses += entry.expenses;
  }

  const ledgers = data.ledgers.filter((ledger) => inScope(ledger.management));

  return {
    asOf: data.asOf,
    operations: data.operations.filter((operation) => inScope(operation.management.reference)),
    history: [...months.values()].sort((a, b) => a.month.localeCompare(b.month)),
    ledger: {
      assets: ledgers.reduce((sum, ledger) => sum + ledger.assets, 0),
      liabilities: ledgers.reduce((sum, ledger) => sum + ledger.liabilities, 0),
    },
  };
}
