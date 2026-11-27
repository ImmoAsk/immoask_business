// Rent collections ("encaissements"): rent received for a lease, and rent prompts.
import type { User } from "../accounts/accounts.types";
import type { Contrat } from "../rent_agreements/rent_agreements.types";
import type { ID } from "../shared/shared.types";

/** A rent amount due or collected for a lease. Every field is nullable in the schema. */
export type RentCollection = {
  id: ID | null;
  montant: number | null;
  statut: number | null;
  contrat_id: number | null;
};

/** Result of a rent prompt (request / reminder for a rent). */
export type RentPromptResult = {
  status: string | null;
  message: string | null;
  rent: RentCollection | null;
};

/** A rent payment received ("encaissement") for a lease. */
export type Encaissement = {
  id: ID;
  date_encaissement: string | null;
  date_paiement: string;
  contrat: Contrat;
  /** The user who recorded / received the payment. */
  encaisseur: User;
  observation: string | null;
  /** Receipt file. */
  recu: string | null;
  type_encaissement: number | null;
  statut: number | null;
  periode_couverte: string;
  /** `Int` in the schema (whole currency units). */
  montant_final: number;
};
