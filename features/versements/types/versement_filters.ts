import type { VersementCurrency, VersementMethod, VersementType } from "./versement";

/** Deposit type tabs above the table. */
export type VersementTab = "tous" | VersementType;

export type VersementFilters = {
  method: "tous" | VersementMethod;
  /** Deposited within the last N days. */
  period: "tous" | "7" | "30";
  /** "Devise" chips in the extra filters. */
  currency: "tous" | VersementCurrency;
};

export type VersementOption<T extends string = string> = { value: T; label: string };
