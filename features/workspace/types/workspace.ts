import type { ManagementAgreementStatus } from "@/features/management_agreements/types";

/** "Tous les contrats" / "Toute la période". */
export const WORKSPACE_ALL = "tous";

/** A management contract offered in the header, as the API lists it. */
export type WorkspaceContract = {
  id: string;
  /** "CG-2026-0001" */
  reference: string;
  owner: string;
  /** "Résidence Les Palmiers · Tokoin, Lomé" */
  building: string;
  status: ManagementAgreementStatus;
  /** ISO "YYYY-MM-DD": the first contract's date opens the period list. */
  signedAt: string;
  /**
   * Properties the contract covers, as names found in property labels
   * ("Résidence Les Palmiers" matches "Appartement A4 · Résidence Les Palmiers").
   */
  properties: string[];
};

/** A month offered in the header. */
export type WorkspacePeriod = {
  /** ISO "YYYY-MM". */
  value: string;
  /** "Novembre 2026" */
  label: string;
  /** First and last day, ISO "YYYY-MM-DD". */
  start: string;
  end: string;
};

/** What the header has selected: a contract reference and a month, or `WORKSPACE_ALL`. */
export type WorkspaceSelection = {
  contract: string;
  period: string;
};
