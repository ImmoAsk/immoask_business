import type { PropertyKind } from "@/components/ui/property_thumbnail";
import { propertyPhotoUrl } from "@/lib/api/config";
import {
  agreementReference,
  assignedProperties,
} from "@/features/management_agreements/hooks/management_agreements_mapper";
import type { ManagementAgreementItem } from "@/lib/api/management_agreements/management_agreements.types";
import type { PortofolioPropertyItem } from "@/lib/api/portofolios/portofolios.types";
import type {
  PortofolioBien,
  PortofolioBienFeature,
  PortofolioData,
} from "../types";

const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

/** Thumbnail kind from the backend category ("Villa", "Appartement meublé"…), falling back on the usage. */
function kindOf({ propriete }: PortofolioPropertyItem): PropertyKind {
  const category = normalize(propriete.categorie_propriete?.denomination ?? "");
  if (category.includes("terrain") || category.includes("parcelle"))
    return "terrain";
  if (category.includes("immeuble")) return "immeuble";
  if (category.includes("studio") || category.includes("chambre"))
    return "studio";
  if (category.includes("appart")) return "appartement";
  if (/boutique|magasin|bureau|commerc|entrepot/.test(category))
    return "boutique";
  if (category.includes("villa") || category.includes("maison")) return "villa";
  return propriete.usage === "Commercial" ? "boutique" : "villa";
}

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);
const plural = (count: number, word: string) =>
  `${count} ${word}${count > 1 ? "s" : ""}`;

/** What the property is offered for, from `offre.denomination` ("louer", "vendre", "bailler"). */
function offerOf({ propriete }: PortofolioPropertyItem) {
  return normalize(propriete.offre?.denomination ?? "").trim() || null;
}

/** First line of "Bien & Réf.": "Appartement à louer", "Terrain à vendre". */
function titleOf(item: PortofolioPropertyItem) {
  const category = item.propriete.categorie_propriete?.denomination?.trim();
  const offer = item.propriete.offre?.denomination?.trim();
  if (!category) return item.propriete.titre;
  return offer
    ? `${capitalize(category)} à ${offer.toLowerCase()}`
    : capitalize(category);
}

/** The landmark part of the address ("novissi,Derrière CIB Novissi" → "Derrière CIB Novissi"). */
function landmarkOf({ propriete }: PortofolioPropertyItem) {
  const parts = (propriete.adresse?.libelle ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const quartier = normalize(propriete.quartier?.denomination ?? "");
  return parts.filter((part) => normalize(part) !== quartier).join(", ");
}

/** The backend's placeholder picture, given to properties uploaded without photos. */
const isDefaultPhoto = (file: string) => file.startsWith("defaut-immobilier");

/**
 * The property's first picture (by position, real photos before the default one), as a shareable URL.
 * File names without an extension are skipped: those files are missing on the server.
 */
export function photoOf({
  propriete,
}: PortofolioPropertyItem): string | undefined {
  const files = (propriete.visuels ?? [])
    .flatMap((visuel) =>
      visuel && visuel.est_image === "Image"
        ? [{ file: visuel.url || visuel.uri, position: visuel.position ?? 0 }]
        : [],
    )
    .filter(
      (visuel): visuel is { file: string; position: number } =>
        !!visuel.file && /\.[a-z0-9]{2,5}$/i.test(visuel.file),
    )
    .sort(
      (a, b) =>
        Number(isDefaultPhoto(a.file)) - Number(isDefaultPhoto(b.file)) ||
        a.position - b.position,
    );
  return propertyPhotoUrl(files[0]?.file);
}

function featuresOf({
  propriete,
}: PortofolioPropertyItem): PortofolioBienFeature[] {
  const features: PortofolioBienFeature[] = [];
  const rooms = [
    propriete.piece ? plural(propriete.piece, "pièce") : null,
    propriete.salon ? plural(propriete.salon, "salon") : null,
    propriete.wc_douche_interne ? `${propriete.wc_douche_interne} Sdb` : null,
  ].filter(Boolean);
  if (rooms.length > 0)
    features.push({ icon: "rooms", label: rooms.join(" • ") });
  if (propriete.surface)
    features.push({
      icon: "surface",
      label: `Surface : ${propriete.surface} m²`,
    });
  const extras = [
    propriete.est_meuble ? "Meublé" : null,
    propriete.piscine ? "Piscine" : null,
    propriete.jardin ? "Jardin" : null,
    propriete.balcon ? "Balcon" : null,
    propriete.garage ? "Garage" : null,
    propriete.gardien_securite ? "Gardien" : null,
    propriete.etage ? `${propriete.etage}e étage` : null,
  ].filter(Boolean);
  if (extras.length > 0)
    features.push({ icon: "extra", label: extras.slice(0, 3).join(" • ") });
  return features;
}

/** A portfolio row as the portfolio screen shows it; `contracts` maps property id → contract reference. */
export function toPortofolioBien(
  item: PortofolioPropertyItem,
  contracts: Map<string, string>,
): PortofolioBien {
  const { propriete } = item;
  const forSale = offerOf(item) === "vendre";
  const vacant = propriete.est_disponible === 1;
  const { lat_propriete: lat, long_propriete: lng } = propriete;
  return {
    id: propriete.id,
    reference: `N°${propriete.nuo}`,
    title: titleOf(item),
    type: kindOf(item),
    ownerName: item.proprietaire?.name ?? "—",
    management: { reference: contracts.get(propriete.id) ?? "" },
    location: {
      quartier: propriete.quartier?.denomination ?? "—",
      city: propriete.ville?.denomination ?? "—",
      zone: landmarkOf(item),
    },
    coordinates: lat && lng ? { lat, lng } : null,
    features: featuresOf(item),
    status: vacant ? "vacant" : "loue",
    statusNote: vacant ? "Dispo" : undefined,
    units: { total: 1, occupied: vacant ? 0 : 1 },
    occupant: forSale
      ? { kind: "libre", label: "À vendre" }
      : vacant
        ? { kind: "libre", label: "À louer" }
        : { kind: "agence", label: "Occupé" },
    rent: forSale ? 0 : (propriete.cout_mensuel ?? 0),
    forSale,
    salePrice: forSale ? (propriete.cout_vente ?? 0) : undefined,
    photoUrl: photoOf(item),
  };
}

export function toPortofolioData(
  items: PortofolioPropertyItem[],
  agreements: ManagementAgreementItem[],
): PortofolioData {
  const contracts = new Map<string, string>();
  for (const agreement of agreements) {
    for (const assignment of assignedProperties(agreement))
      contracts.set(assignment.propriete.id, agreementReference(agreement));
  }
  // No revenue history on the backend yet: the revenue card shows this month only.
  return {
    biens: items.map((item) => toPortofolioBien(item, contracts)),
    revenueHistory: [],
  };
}
