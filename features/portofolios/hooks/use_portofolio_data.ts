"use client";

import { useUserResource } from "@/features/workspace/hooks/use_user_resource";
import { getManagementAgreementsForUser } from "@/lib/api/management_agreements/management_agreements.services";
import { getPortofolioPropertiesForUser } from "@/lib/api/portofolios/portofolios.services";
import type { ScopedUser } from "@/lib/api/shared/roles";
import type { PortofolioData } from "../types";
import { toPortofolioData } from "./portofolio_mapper";

export type UsePortofolioDataResult = {
  data: PortofolioData | null;
  isLoading: boolean;
  error: string | null;
};

/** The user's portfolio, with each property's management contract (so the header's contract narrows it). */
async function loadPortofolio(user: ScopedUser): Promise<PortofolioData> {
  const [portofolio, agreements] = await Promise.all([
    getPortofolioPropertiesForUser(user),
    getManagementAgreementsForUser(user),
  ]);
  return toPortofolioData(portofolio, agreements);
}

/** Portfolio of the signed-in user, scoped by their role. */
export function usePortofolioData(): UsePortofolioDataResult {
  return useUserResource(loadPortofolio);
}
