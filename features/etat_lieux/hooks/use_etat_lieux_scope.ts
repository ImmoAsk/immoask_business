"use client";

import { useWorkspaceScope } from "@/features/workspace/hooks";
import type { Inventory } from "../types";

/** The header's contract and period: inventories of that contract's properties carried out during the month. */
export function useEtatLieuxInScope(inventories: Inventory[]) {
  const scope = useWorkspaceScope();
  return inventories.filter((inventory) => scope.matchesProperty(inventory.property) && scope.inPeriod(inventory.date));
}
