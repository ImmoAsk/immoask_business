/** Figures for the four cards. */
export type ReservationKpis = {
  newOnes: { count: number; total: number; history: number[] };
  inProgress: {
    count: number;
    /** Furnished properties occupied now / all furnished properties. */
    occupied: number;
    properties: number;
    occupiedPercent: number;
  };
  departures: { count: number; withinDays: number };
  done: { count: number; nights: number };
};
