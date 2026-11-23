import type { RentPayment } from "./rent_payment";

export type * from "./rent_payment";
export type * from "./rent_payment_filters";
export type * from "./rent_payment_kpi";

/** Everything the rent payments page loads. */
export type RentPaymentsData = {
  /** Reference day for due dates, ISO "YYYY-MM-DD". */
  asOf: string;
  payments: RentPayment[];
};
