import type { Locataire } from "./locataire";

export type * from "./locataire";
export type * from "./locataire_filters";
export type * from "./locataire_kpi";

/** Everything the tenants page loads. */
export type LocatairesData = {
  /** Reference day for due dates and lease ends, ISO "YYYY-MM-DD". */
  asOf: string;
  locataires: Locataire[];
  /** Active tenants in the previous months, oldest first. */
  activeHistory: number[];
  /** Share of tenants up to date in the previous months (%), oldest first. */
  upToDateRateHistory: number[];
};
