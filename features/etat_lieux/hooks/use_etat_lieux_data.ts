"use client";

import { mockEtatLieux } from "@/mocks/etat_lieux";
import type { EtatLieuxData } from "../types";

export type UseEtatLieuxDataResult = { data: EtatLieuxData; isLoading: boolean };

/**
 * Move-in and move-out inventories.
 * Serves mock data for now; swap the body for lib/api/etat_lieux once the API exists.
 */
export function useEtatLieuxData(): UseEtatLieuxDataResult {
  return { data: mockEtatLieux, isLoading: false };
}
