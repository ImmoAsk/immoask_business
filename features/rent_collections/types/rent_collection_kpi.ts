/** Figures for the four cards above the table. */
export type RentCollectionKpis = {
  rent: {
    /** Rent received this month, FCFA. */
    amount: number;
    /** Change vs last month, %, null without history. */
    deltaPercent: number | null;
    /** Rent received / rent due this month, %. */
    recoveredPercent: number;
    /** Payments received (all natures). */
    count: number;
    mobileMoneyCount: number;
    otherCount: number;
  };
  charges: { amount: number; water: number; electricity: number };
  deposits: { amount: number; count: number; escrowActive: boolean };
  pending: { amount: number; count: number };
};
