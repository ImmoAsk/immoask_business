// Rent payments: one expected rent of a lease for a month.
import type { Propriete } from "../properties/properties.types";
import type { Contrat } from "../rent_agreements/rent_agreements.types";

export type RentPayment = {
  month: string;
  year: number;
  due_date: string;
  montant: number | null;
  contrat: Contrat;
  propriete: Propriete;
  statut: string;
};
