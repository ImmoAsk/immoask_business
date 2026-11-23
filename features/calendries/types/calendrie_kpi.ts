/** Figures for the four cards. */
export type CalendrieKpis = {
  total: number;
  /** Properties free today. */
  available: number;
  unavailable: number;
  availablePercent: number;
  /** Unavailability periods touching the month on screen, all properties. */
  periodsInMonth: number;
};
