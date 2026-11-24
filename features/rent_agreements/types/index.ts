import type { RentAgreement } from "./rent_agreement";

export type * from "./rent_agreement";
export type * from "./rent_agreement_filters";
export type * from "./rent_agreement_kpi";

/** Everything the rent agreements page loads. */
export type RentAgreementsData = {
  /** Today, ISO "YYYY-MM-DD". */
  asOf: string;
  agreements: RentAgreement[];
  /** Active leases at the end of the previous months, oldest first. */
  activeHistory: number[];
};
