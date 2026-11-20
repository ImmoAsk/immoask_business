"use client";

import { mockDashboard } from "@/mocks/dashboard";
import type { DashboardData } from "../types";

export type UseDashboardDataResult = {
  data: DashboardData;
  isLoading: boolean;
};

/**
 * Dashboard data for the current owner.
 * Serves mock data for now; swap the body for lib/api/dashboard once the API exists.
 */
export function useDashboardData(): UseDashboardDataResult {
  return { data: mockDashboard, isLoading: false };
}
