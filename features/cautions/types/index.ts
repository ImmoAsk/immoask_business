import type { Caution } from "./caution";

export type * from "./caution";
export type * from "./caution_filters";
export type * from "./caution_kpi";

/** Everything the deposits page loads. */
export type CautionsData = {
  /** Today, ISO "YYYY-MM-DD". */
  asOf: string;
  cautions: Caution[];
  /** Amount held at the end of the previous months, oldest first, FCFA. */
  heldHistory: number[];
};
