"use client";

import { todayIso } from "@/features/workspace/hooks/workspace_periods";
import { useUserResource } from "@/features/workspace/hooks/use_user_resource";
import { getRentAgreementsForUser } from "@/lib/api/rent_agreements/rent_agreements.services";
import type { ScopedUser } from "@/lib/api/shared/roles";
import type { RentAgreementsData } from "../types";
import { toRentAgreementsData } from "./rent_agreements_mapper";

export type UseRentAgreementsDataResult = {
  data: RentAgreementsData | null;
  isLoading: boolean;
  error: string | null;
};

async function loadRentAgreements(
  user: ScopedUser,
): Promise<RentAgreementsData> {
  return toRentAgreementsData(await getRentAgreementsForUser(user), todayIso());
}

/** Leases of the signed-in user (super admin: all; owner: theirs), running and finished. */
export function useRentAgreementsData(): UseRentAgreementsDataResult {
  return useUserResource(loadRentAgreements);
}
