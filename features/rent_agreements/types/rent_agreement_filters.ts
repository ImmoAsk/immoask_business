import type { RentAgreementStatus, RentAgreementType, RentDeposit } from "./rent_agreement";

/** Status tabs above the table. */
export type RentAgreementTab = "tous" | RentAgreementStatus;

export type RentAgreementFilters = {
  type: RentAgreementType | "tous";
  /** Management agreement reference. */
  management: string;
  tenant: string;
  /** "Caution" chips in the extra filters. */
  deposit: RentDeposit["mode"] | "tous";
};

export type RentAgreementOption<T extends string = string> = { value: T; label: string };
