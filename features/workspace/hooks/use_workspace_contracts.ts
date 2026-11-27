"use client";

import { toManagementAgreement } from "@/features/management_agreements/hooks/management_agreements_mapper";
import { getManagementAgreementsForUser } from "@/lib/api/management_agreements/management_agreements.services";
import type { ScopedUser } from "@/lib/api/shared/roles";
import type { WorkspaceContract } from "../types";
import { useUserResource } from "./use_user_resource";
import { todayIso } from "./workspace_periods";

export type UseWorkspaceContractsResult = { contracts: WorkspaceContract[]; isLoading: boolean; error: string | null };

/** The signed-in user's contracts as header options (same request as the management agreements screen). */
async function loadWorkspaceContracts(
  user: ScopedUser,
): Promise<WorkspaceContract[]> {
  const today = todayIso();
  const items = await getManagementAgreementsForUser(user);
  return items.map((item) => {
    const agreement = toManagementAgreement(item, today);
    return {
      id: agreement.id,
      reference: agreement.reference,
      label: agreement.label,
      owner: agreement.owner.name,
      building: agreement.building,
      status: agreement.status,
      signedAt: agreement.signedAt,
      properties: item.proprietes
        .filter((assignment) => !assignment.date_retrait)
        .map((assignment) => assignment.propriete.titre),
    };
  });
}

/** Loads the management contracts offered in the header, for the user connected. */
export function useWorkspaceContracts(): UseWorkspaceContractsResult {
  const { data, isLoading, error } = useUserResource(loadWorkspaceContracts);
  return { contracts: data ?? [], isLoading, error };
}
