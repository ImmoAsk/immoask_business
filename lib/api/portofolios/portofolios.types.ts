// Portfolios ("portofolios"): a property under management, with its owner, manager and delegate.
import type { User } from "../accounts/accounts.types";
import type {
  Categorie_propriete,
  Image,
  Offre,
  Propriete,
} from "../properties/properties.types";
import type { Adresse, ID, Quartier, Ville } from "../shared/shared.types";

// ─── Enums (sent and received by name; *_VALUES gives the backend number) ───

export const STATUT_PROPRIETE_VALUES = {
  AgentImmobilierGestion: 202,
  GerantImmobilierGestion: 412,
} as const;
export type StatutPropriete = keyof typeof STATUT_PROPRIETE_VALUES;

export type Portofolio = {
  id: ID;
  propriete: Propriete;
  statut: StatutPropriete | null;
  delegue_gestion: User | null;
  gestionnaire: User | null;
  proprietaire: User | null;
};

// ─── Query results ─────────────────────────────────────────────────────────

/** Role id of the super admin (sees every portfolio, so the query is sent without arguments). */
export { SUPER_ADMIN_ROLE_ID } from "../shared/roles";

type PortofolioUser = Pick<User, "id" | "name" | "email" | "phone" | "avatar">;

/** The fields selected by GET_PORTOFOLIO_PROPERTIES_QUERY. */
export type PortofolioPropertyItem = Pick<Portofolio, "id" | "statut"> & {
  propriete: Pick<
    Propriete,
    | "id"
    | "titre"
    | "descriptif"
    | "surface"
    | "usage"
    | "est_disponible"
    | "cout_mensuel"
    | "statut"
    | "nuo"
    | "piece"
    | "salon"
    | "lat_propriete"
    | "long_propriete"
    | "cuisine"
    | "etage"
    | "garage"
    | "wc_douche_interne"
    | "est_meuble"
    | "piscine"
    | "jardin"
    | "balcon"
    | "gardien_securite"
    | "cout_vente"
  > & {
    /** What the property is offered for: denomination "louer", "vendre" or "bailler". */
    offre: Pick<Offre, "id" | "code" | "denomination"> | null;
    adresse: Pick<Adresse, "id" | "libelle"> | null;
    /** Pictures and videos; `url` / `uri` is a file name under PROPERTY_VISUALS_URL. */
    visuels:
      | (Pick<Image, "id" | "url" | "uri" | "position" | "est_image"> | null)[]
      | null;
    categorie_propriete: Pick<
      Categorie_propriete,
      "id" | "denomination"
    > | null;
    ville: Pick<Ville, "id" | "denomination"> | null;
    quartier: Pick<Quartier, "id" | "denomination"> | null;
  };
  proprietaire: PortofolioUser | null;
  gestionnaire: PortofolioUser | null;
  delegue_gestion: PortofolioUser | null;
};

/** Optional filters of `getPortofolioPropertyByUserID` (ignored for the super admin). */
export type PortofolioPropertiesFilters = {
  statut?: number;
  proprietaire_id?: number;
  gestionnaire_id?: number;
  delegue_gestion_id?: number;
};
