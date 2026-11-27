/** "habitation": residential lease; "commercial": commercial lease; "sejour": short stay with an end date. */
export type RentAgreementType = "habitation" | "commercial" | "sejour";

/** Derived from the dates and any termination, never stored. */
export type RentAgreementStatus = "actif" | "a_venir" | "termine" | "resilie";

/** Deposit as a number of months of rent, or a flat amount. */
export type RentDeposit = { mode: "mois"; months: number } | { mode: "montant"; amount: number };

export type RentTerminationReason = "depart_locataire" | "impayes" | "accord_amiable";

/** A lease ("contrat de location"), always attached to a management agreement and a property. */
export type RentAgreement = {
  id: string;
  /** "CL-2026-0001" */
  reference: string;
  /** `label`: "Immeuble Ave Maria : Contrat de gestion No. CG-2026-0001 entre … et …" */
  management: { reference: string; owner: string; label: string };
  /** "Appartement A1 · Résidence Les Palmiers" */
  property: string;
  type: RentAgreementType;
  tenant: string;
  /** Monthly rent, or the total price of a stay ("montant final"), FCFA. */
  amount: number;
  /** ISO "YYYY-MM-DD". */
  startDate: string;
  /** Last day of a stay. */
  endDate?: string;
  deposit: RentDeposit;
  termination?: { date: string; reason: RentTerminationReason };
};
