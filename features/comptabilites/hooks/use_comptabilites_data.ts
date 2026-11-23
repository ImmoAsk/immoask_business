"use client";

import { mockComptabilites } from "@/mocks/comptabilites";
import type { ComptabilitesData } from "../types";

export type UseComptabilitesDataResult = {
  data: ComptabilitesData;
  isLoading: boolean;
};

/**
 * Bookkeeping of the month in progress, plus closed months.
 * Serves mock data for now; swap the body for lib/api/comptabilite once the API exists.
 */
export function useComptabilitesData(): UseComptabilitesDataResult {
  return { data: mockComptabilites, isLoading: false };
}
