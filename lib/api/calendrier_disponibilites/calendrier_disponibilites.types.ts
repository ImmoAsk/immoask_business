// Availability windows of properties.
import type { Propriete } from "../properties/properties.types";
import type { DateTime, ID } from "../shared/shared.types";

export type Disponibilite = {
  id: ID;
  propriete: Propriete;
  debut_disponibilite: DateTime | null;
  fin_disponibilite: DateTime | null;
};
