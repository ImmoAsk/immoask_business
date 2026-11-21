"use client";

import { mockProprietaires } from "@/mocks/proprietaires";
import type { ProprietairesData } from "../types";

export type UseProprietairesDataResult = {
  data: ProprietairesData;
  isLoading: boolean;
};

/**
 * Owners managed by the agency.
 * Serves mock data for now; swap the body for lib/api/proprietaires once the API exists.
 */
export function useProprietairesData(): UseProprietairesDataResult {
  return { data: mockProprietaires, isLoading: false };
}
