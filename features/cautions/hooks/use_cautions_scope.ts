"use client";

import { useWorkspaceScope } from "@/features/workspace/hooks";
import type { Caution } from "../types";

/** The header's contract and period: deposits on that contract's properties, already deposited by the end of the month. */
export function useCautionsInScope(cautions: Caution[]) {
  const scope = useWorkspaceScope();
  return cautions.filter((caution) => scope.matchesProperty(caution.agreement.property) && scope.overlapsPeriod(caution.depositedAt));
}
