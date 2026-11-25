/** What the dashboard is asked for: the header's management contract and month. */
export type DashboardQuery = {
  /** Management contract reference, or null for every contract. */
  contract: string | null;
  /** ISO "YYYY-MM". */
  month: string;
};
