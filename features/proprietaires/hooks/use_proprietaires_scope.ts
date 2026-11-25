"use client";

import { useWorkspaceScope } from "@/features/workspace/hooks";
import type { Proprietaire, ProprietairesData } from "../types";

/**
 * The header's management contract: owners with at least one property under it, each showing only those properties.
 * The month's revenue is shared out by lots, so an owner with properties under several contracts is not counted twice.
 */
export function useProprietairesInScope(data: ProprietairesData) {
  const scope = useWorkspaceScope();
  const contract = scope.contract;
  if (!contract) return { proprietaires: data.proprietaires, ownersHistory: data.ownersHistory };

  const proprietaires = data.proprietaires.flatMap((proprietaire): Proprietaire[] => {
    const biens = proprietaire.biens.filter((bien) => scope.matchesContract(bien.management.reference));
    if (biens.length === 0) return [];
    if (biens.length === proprietaire.biens.length) return [proprietaire];
    const lots = (list: typeof biens) => list.reduce((sum, bien) => sum + bien.lots, 0);
    const share = lots(proprietaire.biens) === 0 ? biens.length / proprietaire.biens.length : lots(biens) / lots(proprietaire.biens);
    return [{ ...proprietaire, biens, monthlyRevenue: Math.round((proprietaire.monthlyRevenue * share) / 1000) * 1000 }];
  });
  const history = data.contractOwnersHistory.find((entry) => entry.management === contract.reference);
  return { proprietaires, ownersHistory: history?.owners ?? [] };
}
