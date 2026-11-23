import type { RentCollectionChannel, RentCollectionLineKind } from "./rent_collection";

/** Chips above the table. */
export type RentCollectionQuickFilter = "tous" | "loyers_regles" | "en_attente" | "services_cautions" | "mobile_money";

export type RentCollectionFilters = {
  /** Entries containing a line of this kind ("Prestations et services"). */
  nature: RentCollectionLineKind | "tous";
  channel: RentCollectionChannel | "tous";
  /** Tenant name, or "tous". */
  tenant: string;
};

export type RentCollectionOption<T extends string = string> = { value: T; label: string; count?: number };
