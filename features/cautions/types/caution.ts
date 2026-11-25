/** How the lease sets the deposit: a number of months of rent, or a fixed amount. */
export type CautionMode = "mois" | "montant";

/** "Intacte" while nothing was taken from it, "Modifiée" once rent was paid from it and not yet refilled. */
export type CautionStatus = "intacte" | "modifiee";

/** Money taken from the deposit ("prelevement") or put back by the tenant ("reconstitution"). */
export type CautionMovement = {
  id: string;
  kind: "prelevement" | "reconstitution";
  /** ISO "YYYY-MM-DD". */
  date: string;
  /** "Loyer de septembre" */
  label: string;
  /** FCFA, always positive. */
  amount: number;
};

/** A tenant's security deposit held by the agency ("coffre"). */
export type Caution = {
  id: string;
  /** "CT-2026-0101" */
  reference: string;
  agreement: {
    /** Lease reference, "CL-2026-0001". */
    reference: string;
    tenant: string;
    property: string;
    /** FCFA per month. */
    monthlyRent: number;
  };
  mode: CautionMode;
  /** Months of rent, when `mode` is "mois". */
  months?: number;
  /** Amount deposited, FCFA. */
  amount: number;
  /** ISO "YYYY-MM-DD". */
  depositedAt: string;
  movements: CautionMovement[];
};
