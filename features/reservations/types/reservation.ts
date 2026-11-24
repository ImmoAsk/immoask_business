/** Workflow of a stay: "nouvelle" (to confirm) → "en_cours" (checked in) → "effectuee" (checked out). */
export type ReservationStatus = "nouvelle" | "en_cours" | "effectuee";

/** A stay in a furnished property. */
export type Reservation = {
  id: string;
  /** "RS-2026-0101" */
  reference: string;
  /** "Appartement A7 · Résidence Les Palmiers" */
  property: string;
  owner: string;
  /** Agency staff member managing the property. */
  manager: string;
  tenant: { name: string; /** International format without spaces. */ phone: string };
  /** ISO "YYYY-MM-DD". */
  arrival: string;
  departure: string;
  /** Where the tenant picks up the keys ("lieu de prise"). */
  pickup: string;
  /** Total price of the stay, FCFA. */
  amount: number;
  /** Agency commission on the stay, FCFA. */
  commission: number;
  status: ReservationStatus;
};
