import type { ManagementAgreementStatus, ManagementRemunerationMode } from "./management_agreement";

/** Status tabs above the table. */
export type ManagementAgreementTab = "tous" | ManagementAgreementStatus;

export type ManagementAgreementFilters = {
  mode: ManagementRemunerationMode | "tous";
  manager: string;
  owner: string;
  /** "Biens affectés" chips in the extra filters. */
  biens: "tous" | "avec" | "sans";
};

export type ManagementAgreementOption<T extends string = string> = { value: T; label: string };
