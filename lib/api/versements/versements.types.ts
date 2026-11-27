// Payouts to owners ("versements"), made as bank deposits under a management agreement.
import type { User } from "../accounts/accounts.types";
import type { Contrat_gestion } from "../management_agreements/management_agreements.types";
import type { DateString, DateTime, ID } from "../shared/shared.types";

export type Depot_bancaire = {
  id: ID;
  contrat_gestion: Contrat_gestion;
  montant: number;
  devise: string;
  date_depot: DateString;
  moyen_depot: string;
  type_depot: string;
  reference_transaction: string | null;
  /** The person who made the deposit (backend relation "deposant"). */
  depositaire: User;
  observation: string | null;
  piece_jointe: string | null;
  statut: string;
  /** Id of the user who recorded the deposit. */
  created_by: number;
  created_at: DateTime;
  updated_at: DateTime;
};

export type DepotBancaireResponse = {
  code: number;
  message: string;
  depotBancaire: Depot_bancaire | null;
};
