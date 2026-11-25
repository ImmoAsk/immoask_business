"use client";

import { useWorkspaceScope } from "@/features/workspace/hooks";
import type { RentAgreement } from "../types";

/** The header's contract and period: leases of that management contract running during the month. */
export function useRentAgreementsInScope(agreements: RentAgreement[]) {
  const scope = useWorkspaceScope();
  return agreements.filter(
    (agreement) =>
      scope.matchesContract(agreement.management.reference) &&
      scope.overlapsPeriod(agreement.startDate, agreement.termination?.date ?? agreement.endDate),
  );
}
