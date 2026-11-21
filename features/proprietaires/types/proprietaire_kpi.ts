/** Figures for the four cards above the owner list. */
export type ProprietaireKpis = {
  owners: {
    count: number;
    /** Properties under mandate, all owners. */
    biens: number;
    /** Owners per month, oldest first, ending with this month. */
    history: number[];
  };
  upToDate: {
    /** Paid or scheduled payouts. */
    count: number;
    total: number;
    ratePercent: number;
  };
  toPay: {
    /** Net amount owed to the owners still waiting, FCFA. */
    amount: number;
    count: number;
  };
  renewals: {
    count: number;
    /** Window used for "fin de mandat proche". */
    withinDays: number;
  };
};
