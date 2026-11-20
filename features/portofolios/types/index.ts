import type { PortofolioBien } from "./portofolio_bien";

export type * from "./portofolio_bien";
export type * from "./portofolio_filters";
export type * from "./portofolio_kpi";

/** Everything the portfolio page loads. */
export type PortofolioData = {
  biens: PortofolioBien[];
  /** Revenue of the previous months, oldest first (this month is computed from `biens`). */
  revenueHistory: number[];
};
