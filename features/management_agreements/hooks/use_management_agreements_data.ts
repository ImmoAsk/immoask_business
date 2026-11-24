"use client";

import { mockManagementAgreements } from "@/mocks/management_agreements";
import type { ManagementAgreementsData } from "../types";

export type UseManagementAgreementsDataResult = {
  data: ManagementAgreementsData;
  isLoading: boolean;
};

/**
 * Management agreements (owner mandates) and the properties not yet under one.
 * Serves mock data for now; swap the body for lib/api/contrats-gestion once the API exists.
 */
export function useManagementAgreementsData(): UseManagementAgreementsDataResult {
  return { data: mockManagementAgreements, isLoading: false };
}
