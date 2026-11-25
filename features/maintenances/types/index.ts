import type { Maintenance } from "./maintenance";

export type * from "./maintenance";
export type * from "./maintenance_filters";
export type * from "./maintenance_kpi";

/** Everything the maintenances page loads. */
export type MaintenancesData = {
  /** Today, ISO "YYYY-MM-DD". */
  asOf: string;
  maintenances: Maintenance[];
  /** New requests at the end of the previous weeks, oldest first. */
  newHistory: number[];
};
