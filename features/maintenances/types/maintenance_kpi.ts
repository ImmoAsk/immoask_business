/** Figures for the four cards. */
export type MaintenanceKpis = {
  newOnes: { count: number; total: number; history: number[] };
  resolved: { count: number; total: number; percent: number };
  /** Unresolved for `days` days or more. */
  stale: { count: number; days: number };
  inProgress: { count: number; categories: number };
};
