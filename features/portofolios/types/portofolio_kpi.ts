export type PortofolioOccupancyLevel = "optimal" | "correct" | "faible";

/** Figures for the four cards above the portfolio. */
export type PortofolioKpis = {
  revenue: {
    /** Rent due this month on let properties, in FCFA. */
    amount: number;
    /** Change vs the previous month, null without history. */
    deltaPercent: number | null;
    /** Monthly revenue, oldest first, ending with this month. */
    history: number[];
    activeUnits: number;
  };
  occupancy: {
    occupied: number;
    total: number;
    ratePercent: number;
    level: PortofolioOccupancyLevel;
  };
  availability: { available: number };
  maintenance: {
    count: number;
    /** Closest delivery among properties under works. */
    nextDeliveryInDays: number | null;
    progressPercent: number | null;
  };
};
