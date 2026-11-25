/** Figures for the four cards. */
export type CalendrierKpis = {
  total: number;
  /** Properties free today. */
  available: number;
  unavailable: number;
  availablePercent: number;
  /** Unavailability periods touching the month on screen, all properties. */
  periodsInMonth: number;
};
