"use client";

import { todayIso } from "@/features/workspace/hooks/workspace_periods";
import { useUserResource } from "@/features/workspace/hooks/use_user_resource";
import { getManagementAgreementsForUser } from "@/lib/api/management_agreements/management_agreements.services";
import type { ManagementAgreementItem } from "@/lib/api/management_agreements/management_agreements.types";
import { getPortofolioPropertiesForUser } from "@/lib/api/portofolios/portofolios.services";
import type { PortofolioPropertyItem } from "@/lib/api/portofolios/portofolios.types";
import type { ManagementAgreementsData } from "../types";
import { toManagementAgreementsData } from "./management_agreements_mapper";

export type UseManagementAgreementsDataResult = {
  data: ManagementAgreementsData | null;
  isLoading: boolean;
  error: string | null;
  /** The portfolio (for "Affecter un bien") is still loading: `availableBiens` is empty until then. */
  isLoadingAvailable: boolean;
};

const NO_PROPERTIES: PortofolioPropertyItem[] = [];

/**
 * Management agreements (owner mandates) of the signed-in user, scoped by their role.
 * The contracts show as soon as they arrive; the properties no contract covers follow with the
 * (slower) portfolio request. Both requests are shared with the header and the portfolio screen.
 */
export function useManagementAgreementsData(): UseManagementAgreementsDataResult {
  const agreements = useUserResource<ManagementAgreementItem[]>(
    getManagementAgreementsForUser,
  );
  const portofolio = useUserResource<PortofolioPropertyItem[]>(
    getPortofolioPropertiesForUser,
  );
  return {
    data: agreements.data
      ? toManagementAgreementsData(
          agreements.data,
          portofolio.data ?? NO_PROPERTIES,
          todayIso(),
        )
      : null,
    isLoading: agreements.isLoading,
    error: agreements.error,
    isLoadingAvailable: portofolio.isLoading,
  };
}
