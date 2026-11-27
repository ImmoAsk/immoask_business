// Organisation statistics and BI used by the dashboard.
import type { Organisation } from "../accounts/accounts.types";
import type { Propriete } from "../properties/properties.types";
import type { ID } from "../shared/shared.types";

/** Number of properties of an organisation per business line. */
export type CountsOrg = {
  sejour: number | null;
  acquisition: number | null;
  entreprise: number | null;
  logement: number | null;
};

export type ProprieteOrg = {
  id: ID;
  super_categorie: string | null;
};

export type StatisticsPayload = {
  organisation: Organisation | null;
  statistics: CountsOrg | null;
  proprietes: (Propriete | null)[] | null;
};

export type PropertyCategoryStats = {
  id: number | null;
  denomination: string | null;
  total: number | null;
};

export type ImmoAskBI = {
  /** Resolved by a backend method (`@method`). */
  minCountByTownPropertyUsage: string | null;
};
