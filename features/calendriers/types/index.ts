import type { CalendrierBien, CalendrierPeriod } from "./calendrier";

export type * from "./calendrier";
export type * from "./calendrier_kpi";

/** Everything the availability calendar loads. */
export type CalendriersData = {
  /** Today, ISO "YYYY-MM-DD". */
  asOf: string;
  biens: CalendrierBien[];
  periods: CalendrierPeriod[];
};
