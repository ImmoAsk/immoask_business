// Rent agreements (leases).
import type { User } from "../accounts/accounts.types";
import type { Contrat_gestion } from "../management_agreements/management_agreements.types";
import type {
  Categorie_propriete,
  Propriete,
} from "../properties/properties.types";
import type { ID, Quartier, Ville } from "../shared/shared.types";

/** A lease between an owner and a tenant, for one property under a management agreement. */
export type Contrat = {
  id: ID;
  date_debut: string;
  date_fin: string | null;
  propriete: Propriete;
  proprietaire: User;
  contrat_gestion: Contrat_gestion;
  locataire: User;
  montant_final: number;
  type_contrat: number | null;
  statut: number | null;
};

// ─── Query results ─────────────────────────────────────────────────────────

/** `Contrat.statut` values in use: 1 = running lease, 2 = finished lease. */
export const CONTRAT_STATUT_VALUES = { EnCours: 1, Termine: 2 } as const;

type ContratUser = Pick<User, "id" | "name" | "email" | "phone" | "avatar">;

/** The fields selected by GET_RENT_AGREEMENTS_BY_USER_QUERY. */
export type RentAgreementItem = Pick<
  Contrat,
  "id" | "date_debut" | "date_fin" | "montant_final" | "type_contrat" | "statut"
> & {
  propriete: Pick<
    Propriete,
    "id" | "titre" | "nuo" | "usage" | "cout_mensuel" | "caution_avance"
  > & {
    categorie_propriete: Pick<
      Categorie_propriete,
      "id" | "denomination"
    > | null;
    quartier: Pick<Quartier, "id" | "denomination"> | null;
    ville: Pick<Ville, "id" | "denomination"> | null;
  };
  proprietaire: ContratUser | null;
  locataire: ContratUser | null;
  contrat_gestion:
    | (Pick<Contrat_gestion, "id" | "numero_contrat" | "observation"> & {
        proprietaire: Pick<User, "id" | "name"> | null;
        gestionnaire: Pick<User, "id" | "name"> | null;
      })
    | null;
};

/** Variables of `getContractsByKeyWords`: `statut` is required, the ids are ignored for the super admin. */
export type RentAgreementsFilters = {
  statut: number;
  locataire_id?: number;
  contrat_gestion_id?: number;
  proprietaire_id?: number;
};
