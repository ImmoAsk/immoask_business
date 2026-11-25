import type { MapCoordinates } from "@/components/map";
import type { PropertyKind } from "@/components/ui/property_thumbnail";

export type LocataireLeaseType = "residentiel" | "commercial";

export type LocatairePaymentStatus = "a_jour" | "en_retard";

/** How the rent arrives; drives the icon under the amount. */
export type LocatairePaymentChannel = "virement" | "mobile_money" | "especes";

/** State of the latest rent receipt ("quittance"). */
export type LocataireQuittance =
  | { kind: "envoyee"; date: string; numero: string }
  | { kind: "en_attente"; note: string }
  | { kind: "relance"; date: string; promiseDate?: string };

export type LocataireBien = {
  id: string;
  title: string;
  /** Lot reference, e.g. "VD-204". */
  reference: string;
  kind: PropertyKind;
  quartier: string;
  city: string;
  coordinates: MapCoordinates;
  photoUrl?: string;
};

export type Locataire = {
  id: string;
  /** Person or company name. */
  name: string;
  /** Job, or the contact person for a company. */
  occupation: string;
  /** International format without spaces, e.g. "+22890123456". */
  phone: string;
  bien: LocataireBien;
  /** Management contract of the rented property; the header's contract narrows the list to it. */
  management: { reference: string };
  lease: {
    type: LocataireLeaseType;
    /** ISO dates "YYYY-MM-DD". */
    startDate: string;
    endDate: string;
  };
  /** Monthly rent in FCFA. */
  rent: number;
  payment: {
    status: LocatairePaymentStatus;
    channel: LocatairePaymentChannel;
    /** e.g. "Virement Ecobank", "T-Money". */
    label: string;
    /** Days past the due date when late. */
    daysLate?: number;
  };
  lastQuittance: LocataireQuittance;
};
