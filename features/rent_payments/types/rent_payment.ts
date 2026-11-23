/** How the rent was (or is expected to be) settled. */
export type RentPaymentMethod = "mobile_money" | "virement" | "especes" | "cheque";

/** Derived from the amounts and the due date, never stored. */
export type RentPaymentStatus = "paye" | "partiel" | "a_payer" | "en_retard";

export type RentPayment = {
  id: string;
  /** "PAY-2025-042" */
  reference: string;
  /** Month the rent is for, ISO "YYYY-MM". */
  period: string;
  /** ISO "YYYY-MM-DD". */
  dueDate: string;
  /** Date of the last amount received, when any. */
  paidDate?: string;
  tenant: {
    name: string;
    /** International format without spaces. */
    phone: string;
  };
  bien: {
    title: string;
    quartier: string;
    city: string;
    /** e.g. "A3" */
    lot?: string;
  };
  /** Monthly rent due, FCFA. */
  rent: number;
  /** Received so far for this month, FCFA. */
  paid: number;
  settlement: {
    method: RentPaymentMethod;
    /** e.g. "T-Money", "Virement Ecobank", "Chèque Coris Bank". */
    label: string;
  } | null;
  /** Expected method while nothing is received ("Attente virement"). */
  expectedMethod?: RentPaymentMethod;
};
