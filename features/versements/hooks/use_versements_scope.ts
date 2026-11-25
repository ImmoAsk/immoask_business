"use client";

import { useWorkspaceScope } from "@/features/workspace/hooks";
import type { Versement } from "../types";

/** The header's contract and period: payouts on that management contract deposited during the month. */
export function useVersementsInScope(versements: Versement[]) {
  const scope = useWorkspaceScope();
  return versements.filter((versement) => scope.matchesContract(versement.management.reference) && scope.inPeriod(versement.date));
}
