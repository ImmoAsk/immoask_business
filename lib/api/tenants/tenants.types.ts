// Tenants ("locataires"): the link between an owner, a tenant account and the property rented.
import type { User } from "../accounts/accounts.types";
import type { Propriete } from "../properties/properties.types";
import type { ID } from "../shared/shared.types";

export type Locataire = {
  id: ID;
  date_creation: string | null;
  propriete: Propriete | null;
  proprietaire: User;
  /** The tenant's user account. */
  locataire: User;
  /** Occupation. */
  metier: string | null;
  statut: number | null;
};
