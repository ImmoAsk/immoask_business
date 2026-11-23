import type { RentPayment, RentPaymentKpis } from "../types";
import { paymentStatus } from "./rent_payments_status";

/** Derives the four cards from the payments, so they always match the table. */
export function computeRentPaymentsKpis(payments: RentPayment[], asOf: string): RentPaymentKpis {
  const byStatus = (statuses: string[]) => payments.filter((payment) => statuses.includes(paymentStatus(payment, asOf)));
  const sumRent = (list: RentPayment[]) => list.reduce((sum, payment) => sum + payment.rent, 0);
  const paid = byStatus(["paye"]);
  const partial = byStatus(["partiel"]);
  const unpaid = byStatus(["a_payer", "en_retard"]);
  const partialReceived = partial.reduce((sum, payment) => sum + payment.paid, 0);

  return {
    expected: {
      amount: sumRent(payments),
      leases: payments.length,
      paid: sumRent(paid),
      partial: sumRent(partial),
      unpaid: sumRent(unpaid),
    },
    paid: { amount: sumRent(paid), receipts: paid.length },
    partial: {
      amount: sumRent(partial),
      received: partialReceived,
      remaining: sumRent(partial) - partialReceived,
      count: partial.length,
    },
    unpaid: {
      amount: sumRent(unpaid),
      count: unpaid.length,
      late: unpaid.filter((payment) => paymentStatus(payment, asOf) === "en_retard").length,
    },
  };
}

export function useRentPaymentsKpis(payments: RentPayment[], asOf: string) {
  return computeRentPaymentsKpis(payments, asOf);
}
