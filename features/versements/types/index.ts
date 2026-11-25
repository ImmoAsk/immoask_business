import type { Versement } from "./versement";

export type * from "./versement";
export type * from "./versement_filters";
export type * from "./versement_kpi";

/** Everything the payouts page loads. */
export type VersementsData = {
  /** Today, ISO "YYYY-MM-DD". */
  asOf: string;
  versements: Versement[];
  /** Payouts on record at the end of the previous months, oldest first. */
  history: number[];
};
