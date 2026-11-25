"use client";

import { mockCautions } from "@/mocks/cautions";
import type { CautionsData } from "../types";

export type UseCautionsDataResult = { data: CautionsData; isLoading: boolean };

/**
 * Tenants' security deposits.
 * Serves mock data for now; swap the body for lib/api/cautions once the API exists.
 */
export function useCautionsData(): UseCautionsDataResult {
  return { data: mockCautions, isLoading: false };
}
