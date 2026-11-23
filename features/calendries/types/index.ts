import type { CalendrieBien, CalendriePeriod } from "./calendrie";

export type * from "./calendrie";
export type * from "./calendrie_kpi";

/** Everything the availability calendar loads. */
export type CalendriesData = {
  /** Today, ISO "YYYY-MM-DD". */
  asOf: string;
  biens: CalendrieBien[];
  periods: CalendriePeriod[];
};
