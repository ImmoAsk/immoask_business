"use client";

import { mockCalendriers } from "@/mocks/calendriers";
import type { CalendriersData } from "../types";

export type UseCalendriersDataResult = { data: CalendriersData; isLoading: boolean };

/**
 * Properties and their unavailability periods.
 * Serves mock data for now; swap the body for lib/api/calendriers once the API exists.
 */
export function useCalendriersData(): UseCalendriersDataResult {
  return { data: mockCalendriers, isLoading: false };
}
