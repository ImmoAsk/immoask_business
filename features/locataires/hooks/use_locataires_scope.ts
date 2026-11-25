"use client";

import { useWorkspaceScope } from "@/features/workspace/hooks";
import type { LocatairesData } from "../types";

/** The header's management contract: only the tenants of the properties it covers, with the history of the same contracts. */
export function useLocatairesInScope(data: LocatairesData) {
  const scope = useWorkspaceScope();
  const series = data.history.filter((entry) => scope.matchesContract(entry.management));
  const months = Math.max(0, ...data.history.map((entry) => entry.active.length));
  const activeHistory = Array.from({ length: months }, (_, month) => series.reduce((sum, entry) => sum + (entry.active[month] ?? 0), 0));
  const upToDate = Array.from({ length: months }, (_, month) => series.reduce((sum, entry) => sum + (entry.upToDate[month] ?? 0), 0));
  return {
    locataires: data.locataires.filter((locataire) => scope.matchesContract(locataire.management.reference)),
    activeHistory,
    upToDateRateHistory: activeHistory.map((active, month) => (active === 0 ? 0 : Math.round((upToDate[month] / active) * 1000) / 10)),
  };
}
