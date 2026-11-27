/** "en_attente": signed but not started, or waiting for properties; "resilie": terminated. */
export type ManagementAgreementStatus = "actif" | "en_attente" | "resilie";

export type ManagementOwnerKind = "particulier" | "societe";

/** How the agency (gestionnaire) is paid: a share of rents collected, or a fixed monthly fee. */
export type ManagementRemuneration =
  | { mode: "pourcentage"; percent: number }
  | { mode: "fixe"; amount: number };

export type ManagementRemunerationMode = ManagementRemuneration["mode"];

export type ManagementTerminationReason = "fin_mandat" | "manquement_gestionnaire" | "accord_amiable";

/** A property newly assigned to a contract on this screen. */
export type ManagementAssignedBien = { id: string; label: string };

/** Mandate between an owner and the agency ("contrat de gestion"). */
export type ManagementAgreement = {
  id: string;
  /** "CG-2026-0001" */
  reference: string;
  /** "Immeuble Ave Maria : Contrat de gestion No. CG-2026-0001 entre … et …" (see managementAgreementLabel). */
  label: string;
  /** Agency staff member in charge. */
  manager: string;
  owner: { name: string; kind: ManagementOwnerKind };
  remuneration: ManagementRemuneration;
  /** Bank account the owner's rents are paid into. Masked on screen by default. */
  payout: { iban: string; bank: string };
  /** "Résidence Les Palmiers · Tokoin, Lomé" */
  building: string;
  description: string;
  /** ISO "YYYY-MM-DD". */
  signedAt: string;
  startDate: string;
  status: ManagementAgreementStatus;
  /** Properties (lots) covered. */
  biensCount: number;
  /** Rents of those properties per month, FCFA. */
  monthlyRents: number;
  assigned: ManagementAssignedBien[];
  termination?: { date: string; reason: ManagementTerminationReason };
};

/** A property not covered by any contract yet, offered by "Affecter un bien immobilier". */
export type ManagementAvailableBien = {
  id: string;
  label: string;
  /** "3 pièces · 2e étage · Tokoin" */
  details: string;
};
