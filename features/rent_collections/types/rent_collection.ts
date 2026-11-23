import type { PropertyKind } from "@/components/ui/property_thumbnail";

/** What a payment line covers. */
export type RentCollectionLineKind = "loyer" | "charges" | "caution" | "service";

export type RentCollectionChargeType = "eau" | "electricite" | "entretien";

export type RentCollectionLine = {
  kind: RentCollectionLineKind;
  /** e.g. "Loyer janvier 2025", "Électricité", "Caution (3 mois)". */
  label: string;
  /** FCFA */
  amount: number;
  /** Charges only. */
  chargeType?: RentCollectionChargeType;
  /** Agency commission on this line, % (rent only; charges and deposits carry none). */
  commissionPercent?: number;
};

export type RentCollectionChannel = "mobile_money" | "virement" | "especes";

/**
 * "encaisse": money received; "recu_genere": received and the receipt (quittance) is issued;
 * "en_attente": due, not received yet; "en_retard": past due.
 */
export type RentCollectionStatus = "encaisse" | "recu_genere" | "en_attente" | "en_retard";

export type RentCollection = {
  id: string;
  /** "ENC-2025-084" */
  reference: string;
  /** Payment date, or due date when not received. ISO "YYYY-MM-DD". */
  date: string;
  tenant: {
    name: string;
    /** International format without spaces. */
    phone: string;
  };
  bien: {
    title: string;
    kind: PropertyKind;
    quartier: string;
    city: string;
  };
  lines: RentCollectionLine[];
  channel: RentCollectionChannel;
  /** e.g. "Virement Ecobank", "T-Money". */
  channelLabel: string;
  /** Operator transaction id, e.g. "TM-89421". */
  transactionRef?: string;
  status: RentCollectionStatus;
  /** Days past the due date when late. */
  daysLate?: number;
};
