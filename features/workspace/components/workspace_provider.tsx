"use client";

import { useState, type ReactNode } from "react";
import { useWorkspaceContracts } from "../hooks/use_workspace_contracts";
import { WorkspaceContext, type WorkspaceContextValue } from "../hooks/workspace_context";
import { todayIso, workspacePeriods } from "../hooks/workspace_periods";
import { createWorkspaceScope } from "../hooks/workspace_scope";
import { WORKSPACE_ALL, type WorkspaceSelection } from "../types";

const ALL: WorkspaceSelection = { contract: WORKSPACE_ALL, period: WORKSPACE_ALL };

/**
 * Holds the management contract and period picked in the header for the whole back office.
 * It sits in the /app layout, so the choice survives moving between screens.
 */
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { contracts, isLoading, error } = useWorkspaceContracts();
  const [selection, setSelection] = useState<WorkspaceSelection>(ALL);

  // Contracts load on the client, so "today" is read there too.
  const periods = contracts.length > 0 ? workspacePeriods(contracts, todayIso()) : [];
  // A choice the lists no longer offer falls back to "all".
  const current: WorkspaceSelection = {
    contract: contracts.some((contract) => contract.reference === selection.contract) ? selection.contract : WORKSPACE_ALL,
    period: periods.some((period) => period.value === selection.period) ? selection.period : WORKSPACE_ALL,
  };

  const value: WorkspaceContextValue = {
    contracts,
    periods,
    isLoading,
    error,
    selection: current,
    setContract: (contract) => setSelection((previous) => ({ ...previous, contract })),
    setPeriod: (period) => setSelection((previous) => ({ ...previous, period })),
    reset: () => setSelection(ALL),
    scope: createWorkspaceScope(current, contracts),
  };

  return <WorkspaceContext value={value}>{children}</WorkspaceContext>;
}
