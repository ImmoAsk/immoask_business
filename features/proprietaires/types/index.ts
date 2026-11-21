import type { Proprietaire } from "./proprietaire";

export type * from "./proprietaire";
export type * from "./proprietaire_filters";
export type * from "./proprietaire_kpi";

/** Everything the owners page loads. */
export type ProprietairesData = {
  /** Reference day for mandate ends, ISO "YYYY-MM-DD". */
  asOf: string;
  proprietaires: Proprietaire[];
  /** Owners in the previous months, oldest first. */
  ownersHistory: number[];
};
