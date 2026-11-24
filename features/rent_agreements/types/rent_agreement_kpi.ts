/** Figures for the four cards. */
export type RentAgreementKpis = {
  active: { count: number; total: number; history: number[] };
  rents: {
    /** Monthly rents of active leases (stays excluded), FCFA. */
    amount: number;
    /** Residential share of that amount, %. */
    residentialPercent: number;
    /** Active or upcoming leases of each type. */
    residentialCount: number;
    commercialCount: number;
  };
  /** Finished leases whose deposit must be returned. */
  depositsToReturn: { count: number };
  upcoming: { count: number; withinDays: number };
};
