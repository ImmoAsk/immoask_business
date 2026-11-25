import type { MapCoordinates } from "@/components/map";
import type { PropertyKind } from "@/components/ui/property_thumbnail";

/** Where the owner lives; "diaspora" owners are abroad and paid by international transfer. */
export type ProprietaireProfile = "resident" | "diaspora" | "entreprise";

/** "actif", or mandate on hold (works, dispute, notice given). */
export type ProprietaireStatus = "actif" | "suspendu";

export type ProprietaireMandateType = "exclusif" | "simple";

/** State of this month's payout ("reversement") of the collected rents. */
export type ProprietaireReversementStatus = "a_jour" | "en_attente" | "planifie";

export type ProprietaireTransferChannel = "virement" | "mobile_money";

/** A property managed under the owner's mandate. */
export type ProprietaireBien = {
  id: string;
  title: string;
  reference: string;
  kind: PropertyKind;
  quartier: string;
  /** Commune, used by the "Commune" filter. */
  city: string;
  coordinates: MapCoordinates;
  /** Rentable units in the property. */
  lots: number;
  /** Management contract the property is under. */
  management: { reference: string };
  photoUrl?: string;
};

export type Proprietaire = {
  id: string;
  /** Person or company name. */
  name: string;
  profile: ProprietaireProfile;
  /** City of residence, e.g. "Lomé", "Paris". */
  residence: string;
  /** International format without spaces, e.g. "+22890123456". */
  phone: string;
  status: ProprietaireStatus;
  /** Why the mandate is on hold. */
  statusNote?: string;
  mandate: {
    type: ProprietaireMandateType;
    /** ISO dates "YYYY-MM-DD". */
    startDate: string;
    endDate: string;
    /** Management fee, % of the rents collected. */
    feePercent: number;
  };
  biens: ProprietaireBien[];
  /** Rents collected this month for this owner, FCFA. */
  monthlyRevenue: number;
  reversement: {
    status: ProprietaireReversementStatus;
    channel: ProprietaireTransferChannel;
    /** e.g. "Virement Ecobank", "T-Money". */
    label: string;
    /** Date of the latest transfer sent to the owner. */
    lastTransferDate: string;
    /** Date of the next transfer when "planifie". */
    scheduledDate?: string;
  };
};
