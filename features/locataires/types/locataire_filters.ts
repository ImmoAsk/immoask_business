import type { LocataireLeaseType, LocatairePaymentStatus } from "./locataire";

/** Chips above the list. */
export type LocataireQuickFilter = "tous" | "a_jour" | "en_retard" | "fin_bail" | "commerciaux";

export type LocataireFilters = {
  payment: LocatairePaymentStatus | "tous";
  lease: LocataireLeaseType | "tous";
  /** "city|quartier", or "tous". */
  area: string;
};

export type LocataireView = "tableau" | "carte";

export type LocataireOption<T extends string = string> = { value: T; label: string; count?: number };
