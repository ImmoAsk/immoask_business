import type { PropertyKind } from "@/components/ui/property_thumbnail";

/** Kind of property, drives the thumbnail and the "Type de bien" filter. */
export type PortofolioBienType = PropertyKind;

export type PortofolioBienStatus = "loue" | "vacant" | "en_travaux";

/** Icon shown before each feature line in the table. */
export type PortofolioFeatureIcon = "rooms" | "surface" | "extra";

export type PortofolioBienFeature = {
  icon: PortofolioFeatureIcon;
  label: string;
};

/** Who currently holds the property, shown in "Contrat & Locataire". */
export type PortofolioOccupant =
  | { kind: "locataire"; name: string; detail: string }
  | { kind: "agence"; label: string }
  | { kind: "travaux"; label: string; detail: string }
  | { kind: "libre"; label: string };

export type PortofolioPaymentState = "a_jour" | "virement_recu" | "en_retard";

export type PortofolioCoordinates = { lat: number; lng: number };

export type PortofolioBien = {
  id: string;
  /** Display reference, e.g. "N°2041". */
  reference: string;
  title: string;
  type: PortofolioBienType;
  ownerName: string;
  location: {
    quartier: string;
    city: string;
    /** Administrative zone, e.g. "Golfe 5". */
    zone: string;
  };
  coordinates: PortofolioCoordinates;
  /** Up to three short lines (rooms, surface, a highlight). */
  features: PortofolioBienFeature[];
  status: PortofolioBienStatus;
  /** Extra word for a vacant property: "Dispo", "Prêt". */
  statusNote?: string;
  /** Rentable units ("lots"): 1 for a house, 4 for a building with 4 leases. */
  units: { total: number; occupied: number };
  occupant: PortofolioOccupant;
  /** Monthly rent in FCFA (asking rent when vacant). */
  rent: number;
  /** Line under the rent, e.g. "Total 4 lots". */
  rentNote?: string;
  payment?: PortofolioPaymentState;
  works?: {
    label: string;
    progressPercent: number;
    deliveryInDays: number;
  };
  photoUrl?: string;
};
