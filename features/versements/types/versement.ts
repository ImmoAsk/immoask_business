/** What the payout covers. */
export type VersementType = "loyer" | "caution" | "service";

export type VersementMethod = "virement" | "mobile_money";

export type VersementCurrency = "FCFA" | "EUR" | "USD";

/** A sum paid out by the manager on a management contract, with its proof. */
export type Versement = {
  id: string;
  /** "VS-2026-0301" */
  reference: string;
  management: {
    /** "CG-2026-0001" */
    reference: string;
    owner: string;
    manager: string;
    property: string;
  };
  type: VersementType;
  amount: number;
  currency: VersementCurrency;
  method: VersementMethod;
  /** Masked account the money went to ("IBAN •••• 4821", "T-Money •••• 37 28"). */
  account: string;
  /** Bank or operator transaction reference. */
  transactionRef: string;
  /** Deposit date, ISO "YYYY-MM-DD". */
  date: string;
  /** Proof of payment. */
  attachment: { name: string; /** Bytes. */ size: number };
};
