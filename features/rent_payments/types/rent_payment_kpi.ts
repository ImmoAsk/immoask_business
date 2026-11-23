/** Figures for the four cards above the table, for the month. */
export type RentPaymentKpis = {
  expected: {
    /** All rents due this month, FCFA. */
    amount: number;
    leases: number;
    /** Rent of fully paid, partly paid and unpaid leases: the three bar segments. */
    paid: number;
    partial: number;
    unpaid: number;
  };
  paid: { amount: number; receipts: number };
  partial: { amount: number; received: number; remaining: number; count: number };
  unpaid: { amount: number; count: number; late: number };
};
