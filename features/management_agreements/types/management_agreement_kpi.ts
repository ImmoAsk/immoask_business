/** Figures for the four cards. */
export type ManagementAgreementKpis = {
  active: { count: number; total: number; history: number[] };
  commissions: {
    /** Estimated agency commissions this month on active contracts, FCFA. */
    amount: number;
    /** Rents of active contracts, FCFA. */
    rents: number;
    /** amount / rents, %. */
    percentOfRents: number;
  };
  pending: { count: number };
  biens: { count: number };
};
