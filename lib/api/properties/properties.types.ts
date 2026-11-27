// Properties ("Propriete") and the types hanging off them: category, pictures, badges, equipment, pricing…
import type { User } from "../accounts/accounts.types";
import type { Disponibilite } from "../calendrier_disponibilites/calendrier_disponibilites.types";
import type { Adresse, DateTime, ID, Pays, Quartier, Ville } from "../shared/shared.types";

// ─── Enums (sent and received by name; *_VALUES gives the backend number) ───

export const PROPRIETE_USAGE_VALUES = {
  Logement: 1,
  Habitation: 2,
  Commercial: 3,
  Experience: 4,
  Sejour: 5,
  Investissement: 6,
  Acquisition: 7,
} as const;
export type ProprieteUsage = keyof typeof PROPRIETE_USAGE_VALUES;

export const PROPRIETE_MENAGE_VALUES = {
  Cour_unique: 0,
  Un_menage: 1,
  Deux_menages: 2,
  Trois_menages: 3,
  Quatre_menages: 4,
  Cinq_menages: 5,
  Six_menages: 6,
  Sept_menages: 7,
  Huit_menages: 8,
  Neuf_menages: 9,
} as const;
export type ProprieteMenage = keyof typeof PROPRIETE_MENAGE_VALUES;

export const PROPRIETE_GARAGE_VALUES = {
  Garage_absent: 0,
  Une_Voiture: 1,
  Deux_Voitures: 2,
} as const;
/** Enum of the schema. Note: `Propriete.garage` itself is typed `Int` by the backend. */
export type ProprieteGarage = keyof typeof PROPRIETE_GARAGE_VALUES;

export const IMAGE_PHOTO_VIDEO_VALUES = {
  Image: 1,
  Video: 2,
} as const;
/** Whether a property visual is a picture or a video. */
export type ImagePhotoVideo = keyof typeof IMAGE_PHOTO_VIDEO_VALUES;

// ─── Property ──────────────────────────────────────────────────────────────

/**
 * A property. Integer "flags" (est_meuble, piscine, eau…) are 0 / 1 as sent by the backend;
 * counts (piece, salon, cuisine…) are numbers.
 */
export type Propriete = {
  id: ID;
  descriptif: string;
  est_disponible: number | null;
  est_meuble: number | null;
  titre: string;
  piece: number | null;
  salon: number | null;
  usage: ProprieteUsage | null;
  super_categorie: string | null;
  surface: number;
  garage: number | null;
  etage: number | null;
  cout_mensuel: number | null;
  cout_visite: number | null;
  cout_assistance_client: number | null;
  nuitee: number | null;
  cout_vente: number | null;
  part_min_investissement: number | null;
  caution_avance: string | null;
  honoraire: number | null;
  wc_douche_interne: number | null;
  wc_douche_externe: number | null;
  cuisine: number | null;
  jardin: number | null;
  menage: ProprieteMenage | null;
  lat_long: string | null;
  lat_propriete: number | null;
  long_propriete: number | null;
  lat_long_faux: string | null;
  eau: number | null;
  electricite: number | null;
  piscine: number | null;
  gardien_securite: number | null;
  balcon: number | null;
  terrasse_balcon: number | null;
  conditions_access: string | null;
  est_present_bailleur: number | null;
  statut: number | null;
  prevente: number | null;
  nuo: number;
  papier_propriete: string | null;
  user: User | null;
  /** Nullable: older rows may have no pays_id / orphan FK. */
  pays: Pays | null;
  ville: Ville | null;
  quartier: Quartier | null;
  adresse: Adresse | null;
  categorie_propriete: Categorie_propriete | null;
  disponibilite: Disponibilite | null;
  visuels: (Image | null)[] | null;
  badge_propriete: Badge_propriete[] | null;
  infrastructures: (Infrastructure | null)[] | null;
  meubles: (Equipement | null)[] | null;
  tarifications: (Tarification | null)[] | null;
  offre: Offre | null;
};

export type Categorie_propriete = {
  id: ID;
  code: string | null;
  minus_denomination: string | null;
  denomination: string;
};

export type Badge_propriete = {
  id: ID;
  propriete: Propriete;
  badge: Badge;
  date_expiration: DateTime | null;
};

export type Badge = {
  id: ID;
  badge_name: string | null;
  badge_image: string | null;
};

/** A picture or video of a property. */
export type Image = {
  id: ID;
  uri: string | null;
  url: string | null;
  /** Display order among the property's visuals. */
  position: number | null;
  est_image: ImagePhotoVideo;
  propriete: Propriete;
};

export type Offre = {
  id: ID;
  code: string | null;
  denomination: string | null;
  statut: number | null;
};

/** Furniture / equipment of a property. */
export type Equipement = {
  id: ID;
  libelle: string | null;
  etat: string | null;
  icone: string | null;
  propriete: Propriete | null;
};

/** One price of a property (per mode: night, month, sale…). */
export type Tarification = {
  id: ID;
  mode: string | null;
  statut: number | null;
  propriete: Propriete;
  currency: string | null;
  montant: number;
};

/** Nearby infrastructure (school, market, hospital…). */
export type Infrastructure = {
  id: ID;
  denomination: string | null;
  lat_long: string | null;
  icone: string | null;
  type: string | null;
  propriete: Propriete | null;
};
