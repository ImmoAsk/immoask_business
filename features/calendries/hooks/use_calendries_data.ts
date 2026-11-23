"use client";

import { mockCalendries } from "@/mocks/calendries";
import type { CalendriesData } from "../types";

export type UseCalendriesDataResult = { data: CalendriesData; isLoading: boolean };

/**
 * Properties and their unavailability periods.
 * Serves mock data for now; swap the body for lib/api/calendriers once the API exists.
 */
export function useCalendriesData(): UseCalendriesDataResult {
  return { data: mockCalendries, isLoading: false };
}
