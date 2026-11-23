"use client";

import { mockRentCollections } from "@/mocks/rent_collections";
import type { RentCollectionsData } from "../types";

export type UseRentCollectionsDataResult = {
  data: RentCollectionsData;
  isLoading: boolean;
};

/**
 * Payments received this month.
 * Serves mock data for now; swap the body for lib/api/encaissements once the API exists.
 */
export function useRentCollectionsData(): UseRentCollectionsDataResult {
  return { data: mockRentCollections, isLoading: false };
}
