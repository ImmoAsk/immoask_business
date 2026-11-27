"use client";

import { useState, type ReactNode } from "react";
import { AppShell, type AppShellProps, type SidebarUser } from "@/components/layout";
import { AuthGuard } from "@/features/auth/components/auth_guard";
import { useSession } from "@/features/auth/hooks/use_session";
import { avatarUrl } from "@/lib/api/config";
import { logout } from "@/lib/auth/login";
import { useWorkspace } from "../hooks/workspace_context";
import { WORKSPACE_ALL } from "../types";
import { WorkspaceProvider } from "./workspace_provider";

export type WorkspaceShellProps = {
  /** Sidebar settings; the user and logout come from the stored session. */
  sidebar: Omit<AppShellProps["sidebar"], "user" | "onLogout">;
  /** Header settings other than the contract and period selectors, which this shell fills in. */
  header?: Omit<NonNullable<AppShellProps["header"]>, "contract" | "period">;
  children: ReactNode;
};

/**
 * The back-office frame, with the header's contract and period wired to the shared selection.
 * Only rendered for a signed-in user: others are sent to /login.
 */
export function WorkspaceShell(props: WorkspaceShellProps) {
  return (
    <AuthGuard>
      <WorkspaceProvider>
        <ConnectedShell {...props} />
      </WorkspaceProvider>
    </AuthGuard>
  );
}

const signedOutUser: SidebarUser = { name: "", role: "" };

function ConnectedShell({ sidebar, header, children }: WorkspaceShellProps) {
  const workspace = useWorkspace();
  const session = useSession();
  const [loggingOut, setLoggingOut] = useState(false);

  const user: SidebarUser = session
    ? { name: session.user.fullName, role: session.user.role?.name ?? "", avatarUrl: avatarUrl(session.user.avatar) }
    : signedOutUser;

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    // Clearing the session makes AuthGuard send the user to /login.
    await logout();
  }
  const loadingLabel = workspace.isLoading ? "Chargement…" : null;

  return (
    <AppShell
      sidebar={{ ...sidebar, user, onLogout: handleLogout }}
      header={{
        ...header,
        contract: {
          label: "Contrat de gestion",
          value: workspace.selection.contract,
          options: [
            { value: WORKSPACE_ALL, label: loadingLabel ?? (workspace.error ? "Contrats indisponibles" : "Tous les contrats") },
            ...workspace.contracts.map((contract) => ({ value: contract.reference, label: contract.label })),
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
