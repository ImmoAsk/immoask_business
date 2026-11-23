import type { RentPaymentMethod, RentPaymentStatus } from "./rent_payment";

/** Chips above the table: "tous" or one status. */
export type RentPaymentQuickFilter = "tous" | RentPaymentStatus;

export type RentPaymentFilters = {
  /** Method used, or "attente" for nothing received yet. */
  method: RentPaymentMethod | "attente" | "tous";
  /** Tenant name, or "tous". */
  tenant: string;
};

export type RentPaymentOption<T extends string = string> = { value: T; label: string; count?: number };
