"use client";

import { useWorkspaceScope } from "@/features/workspace/hooks";
import type { Maintenance } from "../types";

/** The header's contract and period: requests on that contract's properties created during the month. */
export function useMaintenancesInScope(maintenances: Maintenance[]) {
  const scope = useWorkspaceScope();
  return maintenances.filter((maintenance) => scope.matchesProperty(maintenance.property) && scope.inPeriod(maintenance.createdAt));
}
