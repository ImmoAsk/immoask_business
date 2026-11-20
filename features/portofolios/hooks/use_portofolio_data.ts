"use client";

import { mockPortofolio } from "@/mocks/portofolios";
import type { PortofolioData } from "../types";

export type UsePortofolioDataResult = {
  data: PortofolioData;
  isLoading: boolean;
};

/**
 * Portfolio of the current owner.
 * Serves mock data for now; swap the body for lib/api/portofolios once the API exists.
 */
export function usePortofolioData(): UsePortofolioDataResult {
  return { data: mockPortofolio, isLoading: false };
}
