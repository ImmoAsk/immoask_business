import type {
  ComptabiliteContractLedger,
  ComptabiliteContractMonth,
  ComptabiliteLedger,
  ComptabiliteMonthTotals,
  ComptabiliteOperation,
} from "./comptabilite_operation";

export type * from "./comptabilite_filters";
export type * from "./comptabilite_kpi";
export type * from "./comptabilite_operation";

/** Everything the accounting page loads: every management contract's books. */
export type ComptabilitesData = {
  /** Today, ISO "YYYY-MM-DD"; its month is the month in progress. */
  asOf: string;
  /** Operations of the month in progress. */
  operations: ComptabiliteOperation[];
  /** Closed months, per management contract. */
  history: ComptabiliteContractMonth[];
  /** Balance sheet, per management contract. */
  ledgers: ComptabiliteContractLedger[];
};

/** The books the page shows: one contract's, or every contract's added up. */
export type ComptabilitesBooks = {
  asOf: string;
  operations: ComptabiliteOperation[];
  /** Closed months, oldest first. */
  history: ComptabiliteMonthTotals[];
  ledger: ComptabiliteLedger;
};
