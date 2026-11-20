export type DashboardVersementStatus = "valide" | "en_attente" | "bloque";

export type DashboardVersementData = {
  amount: number;
  bankName: string;
  accountHolder: string;
  /** ISO date "YYYY-MM-DD". */
  estimatedDate: string;
  status: DashboardVersementStatus;
};
