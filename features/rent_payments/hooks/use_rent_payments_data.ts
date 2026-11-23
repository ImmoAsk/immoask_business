"use client";

import { mockRentPayments } from "@/mocks/rent_payments";
import type { RentPaymentsData } from "../types";

export type UseRentPaymentsDataResult = {
  data: RentPaymentsData;
  isLoading: boolean;
};

/**
 * Rent payments of the current month.
 * Serves mock data for now; swap the body for lib/api/paiements once the API exists.
 */
export function useRentPaymentsData(): UseRentPaymentsDataResult {
  return { data: mockRentPayments, isLoading: false };
}
