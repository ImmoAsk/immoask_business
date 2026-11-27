// Maintenance requests raised by tenants on properties.
import type { User } from "../accounts/accounts.types";
import type { Propriete } from "../properties/properties.types";
import type { ID } from "../shared/shared.types";

export type Maintenance = {
  id: ID;
  propriete: Propriete;
  locataire: User;
  categorie: string;
  description: string | null;
  created_at: string | null;
  statut: number;
  observations: string | null;
  /** Pictures of the issue, as stored by the backend (a single string). */
  images: string;
};
