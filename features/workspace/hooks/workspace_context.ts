"use client";

import { createContext, useContext } from "react";
import type { WorkspaceContract, WorkspacePeriod, WorkspaceSelection } from "../types";
import { WORKSPACE_ALL } from "../types";
import type { WorkspaceScope } from "./workspace_scope";
import { createWorkspaceScope } from "./workspace_scope";

export type WorkspaceContextValue = {
  contracts: WorkspaceContract[];
  periods: WorkspacePeriod[];
  isLoading: boolean;
  error: string | null;
  selection: WorkspaceSelection;
  setContract: (reference: string) => void;
  setPeriod: (month: string) => void;
  /** Back to every contract and the whole period. */
  reset: () => void;
  scope: WorkspaceScope;
};

const ALL: WorkspaceSelection = { contract: WORKSPACE_ALL, period: WORKSPACE_ALL };

/** Outside the provider (tests, isolated stories) nothing is filtered. */
const fallback: WorkspaceContextValue = {
  contracts: [],
  periods: [],
  isLoading: false,
  error: null,
  selection: ALL,
  setContract: () => {},
  setPeriod: () => {},
  reset: () => {},
  scope: createWorkspaceScope(ALL, []),
};

export const WorkspaceContext = createContext<WorkspaceContextValue>(fallback);

/** The header's contract and period, with setters. */
export function useWorkspace() {
  return useContext(WorkspaceContext);
}

/** Filters for the current screen's records; see `createWorkspaceScope`. */
export function useWorkspaceScope() {
  return useContext(WorkspaceContext).scope;
}
