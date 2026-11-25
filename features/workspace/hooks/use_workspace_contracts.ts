"use client";

import { useEffect, useState } from "react";
import { fetchManagementAgreementOptions } from "@/lib/api/management_agreements/management_agreements.services";
import type { WorkspaceContract } from "../types";

export type UseWorkspaceContractsResult = { contracts: WorkspaceContract[]; isLoading: boolean; error: string | null };

/** Loads the management contracts offered in the header. */
export function useWorkspaceContracts(): UseWorkspaceContractsResult {
  const [state, setState] = useState<UseWorkspaceContractsResult>({ contracts: [], isLoading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();
    fetchManagementAgreementOptions(controller.signal)
      .then((contracts) => setState({ contracts, isLoading: false, error: null }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({ contracts: [], isLoading: false, error: error instanceof Error ? error.message : "Erreur de chargement" });
      });
    return () => controller.abort();
  }, []);

  return state;
}
