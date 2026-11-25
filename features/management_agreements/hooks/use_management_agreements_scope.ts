"use client";

import { useWorkspaceScope } from "@/features/workspace/hooks";
import type { ManagementAgreement } from "../types";

/** The header's contract and period: the contract itself, signed by the end of the month and not ended before it. */
export function useManagementAgreementsInScope(agreements: ManagementAgreement[]) {
  const scope = useWorkspaceScope();
  return agreements.filter((agreement) => scope.matchesContract(agreement.reference) && scope.overlapsPeriod(agreement.signedAt, agreement.termination?.date));
}
