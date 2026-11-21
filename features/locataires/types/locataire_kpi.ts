/** Figures for the four cards above the tenant list. */
export type LocataireKpis = {
  active: {
    count: number;
    /** Change vs last month, null without history. */
    delta: number | null;
    /** Active tenants per month, oldest first, ending with this month. */
    history: number[];
  };
  upToDate: {
    count: number;
    total: number;
    ratePercent: number;
    /** Change in percentage points vs last month, null without history. */
    deltaPoints: number | null;
  };
  late: { count: number };
  renewals: {
    count: number;
    /** Window used for "fin de bail proche". */
    withinDays: number;
  };
};
