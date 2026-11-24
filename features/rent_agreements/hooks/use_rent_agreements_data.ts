"use client";

import { mockRentAgreements } from "@/mocks/rent_agreements";
import type { RentAgreementsData } from "../types";

export type UseRentAgreementsDataResult = {
  data: RentAgreementsData;
  isLoading: boolean;
};

/**
 * Leases and their management agreements.
 * Serves mock data for now; swap the body for lib/api/contrats-location once the API exists.
 */
export function useRentAgreementsData(): UseRentAgreementsDataResult {
  return { data: mockRentAgreements, isLoading: false };
}
