import { daysBetween } from "@/lib/utils/dates";
import type { RentPayment, RentPaymentStatus } from "../types";

/** Status from the amounts and the due date, so it can never contradict them. */
export function paymentStatus(payment: RentPayment, asOf: string): RentPaymentStatus {
  if (payment.paid >= payment.rent) return "paye";
  if (payment.paid > 0) return "partiel";
  return daysBetween(payment.dueDate, asOf) > 0 ? "en_retard" : "a_payer";
}

/** Days past the due date (0 when not late). */
export function daysLate(payment: RentPayment, asOf: string) {
  return Math.max(0, daysBetween(payment.dueDate, asOf));
}

export function remaining(payment: RentPayment) {
  return Math.max(0, payment.rent - payment.paid);
}

/** Share of the rent received, 0–100. */
export function paidPercent(payment: RentPayment) {
  return payment.rent === 0 ? 100 : Math.min(100, (payment.paid / payment.rent) * 100);
}
