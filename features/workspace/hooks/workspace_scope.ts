import type { WorkspaceContract, WorkspacePeriod, WorkspaceSelection } from "../types";
import { WORKSPACE_ALL } from "../types";
import { monthPeriod } from "./workspace_periods";

/** Lowercase, accent-free text. */
function normalize(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

/**
 * The header selection as filters every screen applies to its own records.
 * With nothing selected, everything matches.
 */
export function createWorkspaceScope(selection: WorkspaceSelection, contracts: WorkspaceContract[]) {
  const contract = selection.contract === WORKSPACE_ALL ? null : (contracts.find((item) => item.reference === selection.contract) ?? null);
  const period: WorkspacePeriod | null = selection.period === WORKSPACE_ALL ? null : monthPeriod(selection.period);
  const keys = contract?.properties.map(normalize) ?? [];

  return {
    contract,
    period,
    /** True when the header narrows the screens. */
    isFiltered: contract !== null || period !== null,
    /** A record that names its management contract. */
    matchesContract: (reference: string) => contract === null || reference === contract.reference,
    /** A record that only names its property. */
    matchesProperty: (property: string) => contract === null || keys.some((key) => normalize(property).includes(key)),
    /** A dated event (payment, request, inventory…) that happened in the month. */
    inPeriod: (date: string) => period === null || (date >= period.start && date <= period.end),
    /** Something running from `start` to `end` (open-ended without it) that overlaps the month. */
    overlapsPeriod: (start: string, end?: string | null) => period === null || (start <= period.end && (!end || end >= period.start)),
  };
}

export type WorkspaceScope = ReturnType<typeof createWorkspaceScope>;
