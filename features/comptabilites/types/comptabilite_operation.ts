/** Money in (recette) or out (dépense). */
export type ComptabiliteFlow = "recette" | "depense";

export type ComptabiliteIncomeCategory = "loyer" | "caution" | "charges_locatives";
export type ComptabiliteExpenseCategory = "entretien" | "charges_communes" | "autre";
export type ComptabiliteCategory = ComptabiliteIncomeCategory | ComptabiliteExpenseCategory;

/**
 * "regle": received (recette) or paid (dépense);
 * "en_attente": income not received yet; "en_cours": expense committed, not paid yet.
 */
export type ComptabiliteStatus = "regle" | "en_attente" | "en_cours";

export type ComptabiliteOperation = {
  id: string;
  /** Accounting voucher number, e.g. "OP-2026-1142". */
  reference: string;
  /** ISO "YYYY-MM-DD". */
  date: string;
  flow: ComptabiliteFlow;
  category: ComptabiliteCategory;
  description: string;
  bien: string;
  /** Tenant or supplier; absent for internal entries. */
  counterparty?: string;
  /** FCFA, always positive; `flow` gives the direction. */
  amount: number;
  status: ComptabiliteStatus;
};

/** Totals of a past month, ISO "YYYY-MM". */
export type ComptabiliteMonthTotals = {
  month: string;
  income: number;
  expenses: number;
};
