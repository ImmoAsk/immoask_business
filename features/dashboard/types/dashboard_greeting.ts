export type DashboardGreetingData = {
  firstName: string;
  /** Month the collection rate refers to, ISO "YYYY-MM". */
  month: string;
  /** Share of the month's rents already collected, 0–100. */
  collectedRate: number;
  /** Number of tenants still to chase for the month. */
  tenantsToRemind: number;
  synced: boolean;
};
