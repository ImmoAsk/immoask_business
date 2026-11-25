/** Figures for the four cards. */
export type CautionKpis = {
  /** What the agency holds now. */
  held: { amount: number; count: number; history: number[] };
  intact: { count: number; total: number; percent: number };
  modified: { count: number };
  /** Taken for rent and not refilled yet. */
  used: { amount: number };
};
