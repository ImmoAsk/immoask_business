"use client";

import { mockVersements } from "@/mocks/versements";
import type { VersementsData } from "../types";

export type UseVersementsDataResult = { data: VersementsData; isLoading: boolean };

/**
 * Payouts made on management contracts.
 * Serves mock data for now; swap the body for lib/api/versements once the API exists.
 */
export function useVersementsData(): UseVersementsDataResult {
  return { data: mockVersements, isLoading: false };
}
