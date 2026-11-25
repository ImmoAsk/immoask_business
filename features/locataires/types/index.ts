import type { Locataire } from "./locataire";

export type * from "./locataire";
export type * from "./locataire_filters";
export type * from "./locataire_kpi";

/** Everything the tenants page loads. */
export type LocatairesData = {
  /** Reference day for due dates and lease ends, ISO "YYYY-MM-DD". */
  asOf: string;
  locataires: Locataire[];
  /**
   * Previous months per management contract, oldest first:
   * active tenants, and how many of them were up to date.
   */
  history: { management: string; active: number[]; upToDate: number[] }[];
};
