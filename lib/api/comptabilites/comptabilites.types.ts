// Accounting: income and expense entries of properties and owners.
import type { User } from "../accounts/accounts.types";
import type { Propriete } from "../properties/properties.types";
import type { Contrat } from "../rent_agreements/rent_agreements.types";
import type { ID } from "../shared/shared.types";

/** One accounting entry (income or expense), optionally tied to a property, owner and lease. */
export type Mouvement_comptable = {
  id: ID;
  propriete: Propriete | null;
  statut: number | null;
  proprietaire: User | null;
  montant: number;
  contrat: Contrat | null;
  /** Receipt file. */
  recu: string | null;
  description: string | null;
  type_mouvement: string;
  source_mouvement: string;
  date_paiement: string | null;
  created_at: string | null;
};
