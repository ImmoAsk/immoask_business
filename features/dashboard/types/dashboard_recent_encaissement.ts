export type DashboardEncaissementStatus = "paye" | "en_retard" | "en_attente";

export type DashboardRecentEncaissementData = {
  id: string;
  tenantName: string;
  propertyName: string;
  location: string;
  amount: number;
  /** Payment channel, e.g. "Mixx by Yas", "Virement Ecobank". */
  method: string;
  status: DashboardEncaissementStatus;
  receiptUrl?: string;
};
