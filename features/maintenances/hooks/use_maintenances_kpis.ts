import type { Maintenance, MaintenanceKpis } from "../types";
import { isStale, STALE_DAYS } from "./maintenances_age";

/** Derives the four cards from the requests, so they always match the table. */
export function computeMaintenancesKpis(maintenances: Maintenance[], asOf: string, newHistory: number[]): MaintenanceKpis {
  const byStatus = (status: Maintenance["status"]) => maintenances.filter((maintenance) => maintenance.status === status);
  const newOnes = byStatus("nouvelle");
  const inProgress = byStatus("en_traitement");
  const resolved = byStatus("resolue");
  const total = maintenances.length;

  return {
    newOnes: { count: newOnes.length, total, history: [...newHistory, newOnes.length] },
    resolved: { count: resolved.length, total, percent: total === 0 ? 0 : (resolved.length / total) * 100 },
    stale: { count: maintenances.filter((maintenance) => isStale(maintenance, asOf)).length, days: STALE_DAYS },
    inProgress: { count: inProgress.length, categories: new Set(inProgress.map((maintenance) => maintenance.category)).size },
  };
}

export function useMaintenancesKpis(maintenances: Maintenance[], asOf: string, newHistory: number[]) {
  return computeMaintenancesKpis(maintenances, asOf, newHistory);
}
