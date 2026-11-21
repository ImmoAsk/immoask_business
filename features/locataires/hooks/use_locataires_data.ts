"use client";

import { mockLocataires } from "@/mocks/locataires";
import type { LocatairesData } from "../types";

export type UseLocatairesDataResult = {
  data: LocatairesData;
  isLoading: boolean;
};

/**
 * Tenants of the current owner.
 * Serves mock data for now; swap the body for lib/api/locataires once the API exists.
 */
export function useLocatairesData(): UseLocatairesDataResult {
  return { data: mockLocataires, isLoading: false };
}
