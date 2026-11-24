"use client";

import { mockReservations } from "@/mocks/reservations";
import type { ReservationsData } from "../types";

export type UseReservationsDataResult = { data: ReservationsData; isLoading: boolean };

/**
 * Stays in furnished properties.
 * Serves mock data for now; swap the body for lib/api/reservations once the API exists.
 */
export function useReservationsData(): UseReservationsDataResult {
  return { data: mockReservations, isLoading: false };
}
