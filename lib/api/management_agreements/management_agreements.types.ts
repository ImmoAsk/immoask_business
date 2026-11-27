// Management agreements ("contrats de gestion") and the properties they cover.
import type { User } from "../accounts/accounts.types";
import type { Propriete } from "../properties/properties.types";
import type { Contrat } from "../rent_agreements/rent_agreements.types";
import type {
  DateString,
  DateTime,
  ID,
  Quartier,
  Ville,
} from "../shared/shared.types";
import type { Depot_bancaire } from "../versements/versements.types";

/** Agreement by which a manager (gestionnaire) manages an owner's properties. */
export type Contrat_gestion = {
  id: ID;
  numero_contrat: string | null;
  compte_bancaire_iban: string | null;
  gestionnaire: User;
  proprietaire: User;
  /** Spelled as in the backend schema. */
  mode_renumeration: string;
  taux_gestion: number | null;
  montant_fixe: number | null;
  date_signature: DateString;
  date_debut: DateString;
  date_fin: DateString | null;
  statut: number;
  document: string | null;
  observation: string | null;
  createur: User | null;
  /** Optional: the table may not have timestamp columns. */
  created_at: DateTime | null;
  updated_at: DateTime | null;
  proprietes: Contrat_gestion_propriete[];
  depots_bancaires: Depot_bancaire[];
  contrats_location: Contrat[];
};

/** A property assigned to a management agreement (and possibly withdrawn later). */
export type Contrat_gestion_propriete = {
  id: ID;
  contrat_gestion: Contrat_gestion;
  propriete: Propriete;
  statut: string;
  observations: string | null;
  date_affectation: DateString;
  date_retrait: DateString | null;
};

export type ContratGestionResponse = {
  code: number;
  message: string;
  contratGestion: Contrat_gestion | null;
};

export type ContratGestionProprieteResponse = {
  code: number;
  message: string;
  contratGestionPropriete: Contrat_gestion_propriete | null;
};

// ─── Query results ─────────────────────────────────────────────────────────

type ContratGestionUser = Pick<
  User,
  "id" | "name" | "email" | "phone" | "avatar"
>;

/** The fields selected by GET_MANAGEMENT_AGREEMENTS_BY_USER_QUERY. */
export type ManagementAgreementItem = Pick<
  Contrat_gestion,
  | "id"
  | "numero_contrat"
  | "mode_renumeration"
  | "taux_gestion"
  | "montant_fixe"
  | "date_signature"
  | "date_debut"
  | "date_fin"
  | "statut"
  | "document"
  | "observation"
  | "compte_bancaire_iban"
> & {
  gestionnaire: ContratGestionUser;
  proprietaire: ContratGestionUser;
  proprietes: (Pick<
    Contrat_gestion_propriete,
    "id" | "statut" | "date_affectation" | "date_retrait"
  > & {
    propriete: Pick<Propriete, "id" | "titre" | "nuo" | "cout_mensuel"> & {
      quartier: Pick<Quartier, "id" | "denomination"> | null;
      ville: Pick<Ville, "id" | "denomination"> | null;
    };
  })[];
};

/** Variables of `getContratGestionByKeyWords`: `statut` is required, the user ids are ignored for the super admin. */
export type ManagementAgreementsFilters = {
  statut: number;
  gestionnaire_id?: number;
  proprietaire_id?: number;
};

/** `Contrat_gestion.statut` of an active contract. */
export const CONTRAT_GESTION_STATUT_ACTIF = 1;
