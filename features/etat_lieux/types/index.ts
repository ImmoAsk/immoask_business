import type { Inventory } from "./etat_lieux";

export type * from "./etat_lieux";
export type * from "./etat_lieux_filters";
export type * from "./etat_lieux_kpi";

/** Everything the inventories page loads. */
export type EtatLieuxData = {
  /** Today, ISO "YYYY-MM-DD". */
  asOf: string;
  inventories: Inventory[];
  /** Inventories on record at the end of the previous months, oldest first. */
  history: number[];
};
