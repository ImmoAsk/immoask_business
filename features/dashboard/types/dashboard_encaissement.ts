/** Rent collected in one month. */
export type DashboardEncaissementPoint = {
  /** ISO month "YYYY-MM". */
  month: string;
  amount: number;
};

export type DashboardEncaissementPeriod = "mensuel" | "trimestre";

/** One plotted point, after grouping by period. */
export type DashboardEncaissementSeriesPoint = {
  key: string;
  label: string;
  /** Full label for tooltips and the data table. */
  longLabel: string;
  amount: number;
};
