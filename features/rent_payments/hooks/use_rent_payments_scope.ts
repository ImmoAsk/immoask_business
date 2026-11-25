"use client";

import { useWorkspaceScope } from "@/features/workspace/hooks";
import type { RentPayment } from "../types";

/** The header's contract and period: rents of that contract's properties for the month. */
export function useRentPaymentsInScope(payments: RentPayment[]) {
  const scope = useWorkspaceScope();
  return payments.filter((payment) => scope.matchesContract(payment.management.reference) && scope.inPeriod(`${payment.period}-01`));
}
