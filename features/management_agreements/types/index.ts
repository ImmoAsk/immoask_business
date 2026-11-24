import type { ManagementAgreement, ManagementAvailableBien } from "./management_agreement";

export type * from "./management_agreement";
export type * from "./management_agreement_filters";
export type * from "./management_agreement_kpi";

/** Everything the management agreements page loads. */
export type ManagementAgreementsData = {
  /** Today, ISO "YYYY-MM-DD". */
  asOf: string;
  agreements: ManagementAgreement[];
  availableBiens: ManagementAvailableBien[];
  /** Active contracts at the end of the previous months, oldest first. */
  activeHistory: number[];
};
