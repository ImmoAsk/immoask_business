"use client";

import { mockMaintenances } from "@/mocks/maintenances";
import type { MaintenancesData } from "../types";

export type UseMaintenancesDataResult = { data: MaintenancesData; isLoading: boolean };

/**
 * Repair requests on managed properties.
 * Serves mock data for now; swap the body for lib/api/maintenances once the API exists.
 */
export function useMaintenancesData(): UseMaintenancesDataResult {
  return { data: mockMaintenances, isLoading: false };
}
