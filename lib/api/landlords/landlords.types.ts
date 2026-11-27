// Landlords ("proprietaires"): the link between a manager (gestionnaire) and an owner account.
import type { User } from "../accounts/accounts.types";
import type { ID } from "../shared/shared.types";

export type Proprietaire = {
  id: ID;
  date_creation: string | null;
  /** The managing user (gestionnaire). */
  gestionnaire: User;
  /** The owner's user account. */
  proprietaire: User;
  /** Occupation. */
  metier: string | null;
  statut: number | null;
};
