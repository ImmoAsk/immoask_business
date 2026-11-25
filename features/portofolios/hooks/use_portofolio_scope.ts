"use client";

import { useWorkspaceScope } from "@/features/workspace/hooks";
import type { PortofolioData } from "../types";

/** The header's management contract: only the properties it covers, and the revenue history of the same contracts. */
export function usePortofolioInScope(data: PortofolioData) {
  const scope = useWorkspaceScope();
  const series = data.revenueHistory.filter((entry) => scope.matchesContract(entry.management));
  const months = Math.max(0, ...data.revenueHistory.map((entry) => entry.amounts.length));
  return {
    biens: data.biens.filter((bien) => scope.matchesContract(bien.management.reference)),
    revenueHistory: Array.from({ length: months }, (_, month) => series.reduce((sum, entry) => sum + (entry.amounts[month] ?? 0), 0)),
  };
}
