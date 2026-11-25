import type { RentCollection } from "./rent_collection";

export type * from "./rent_collection";
export type * from "./rent_collection_filters";
export type * from "./rent_collection_kpi";

/** Everything the rent collections page loads. */
export type RentCollectionsData = {
  /** Reference day, ISO "YYYY-MM-DD". */
  asOf: string;
  collections: RentCollection[];
  /** Rent received last month, per management contract, FCFA (for the trend). */
  previousMonthRents: { management: string; amount: number }[];
  /** Deposits are held on an escrow account. */
  escrowActive: boolean;
};
