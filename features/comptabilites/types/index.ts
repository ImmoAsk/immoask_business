import type { ComptabiliteMonthTotals, ComptabiliteOperation } from "./comptabilite_operation";

export type * from "./comptabilite_filters";
export type * from "./comptabilite_kpi";
export type * from "./comptabilite_operation";

/** Everything the accounting page loads. */
export type ComptabilitesData = {
  /** Today, ISO "YYYY-MM-DD"; its month is the month in progress. */
  asOf: string;
  /** Operations of the month in progress. */
  operations: ComptabiliteOperation[];
  /** Closed months, oldest first. */
  history: ComptabiliteMonthTotals[];
  /** Balance sheet totals. */
  ledger: { assets: number; liabilities: number };
};
