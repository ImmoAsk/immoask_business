"use client";

import type { ReactNode } from "react";
import { AppShell, type AppShellProps } from "@/components/layout";
import { useWorkspace } from "../hooks/workspace_context";
import { WORKSPACE_ALL } from "../types";
import { WorkspaceProvider } from "./workspace_provider";

export type WorkspaceShellProps = {
  sidebar: AppShellProps["sidebar"];
  /** Header settings other than the contract and period selectors, which this shell fills in. */
  header?: Omit<NonNullable<AppShellProps["header"]>, "contract" | "period">;
  children: ReactNode;
};

/** The back-office frame, with the header's contract and period wired to the shared selection. */
export function WorkspaceShell(props: WorkspaceShellProps) {
  return (
    <WorkspaceProvider>
      <ConnectedShell {...props} />
    </WorkspaceProvider>
  );
}

function ConnectedShell({ sidebar, header, children }: WorkspaceShellProps) {
  const workspace = useWorkspace();
  const loadingLabel = workspace.isLoading ? "Chargement…" : null;

  return (
    <AppShell
      sidebar={sidebar}
      header={{
        ...header,
        contract: {
          label: "Contrat de gestion",
          value: workspace.selection.contract,
          options: [
            { value: WORKSPACE_ALL, label: loadingLabel ?? (workspace.error ? "Contrats indisponibles" : "Tous les contrats") },
            ...workspace.contracts.map((contract) => ({ value: contract.reference, label: `${contract.reference} · ${contract.owner}` })),
          ],
          disabled: workspace.isLoading || workspace.contracts.length === 0,
          onChange: workspace.setContract,
        },
        period: {
          label: "Période",
          value: workspace.selection.period,
          options: [
            { value: WORKSPACE_ALL, label: loadingLabel ?? "Toute la période" },
            ...workspace.periods.map((period) => ({ value: period.value, label: period.label })),
          ],
          disabled: workspace.isLoading || workspace.periods.length === 0,
          onChange: workspace.setPeriod,
        },
      }}
    >
      {children}
    </AppShell>
  );
}
