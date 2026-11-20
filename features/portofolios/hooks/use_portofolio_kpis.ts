import type { PortofolioBien, PortofolioKpis, PortofolioOccupancyLevel } from "../types";

function occupancyLevel(rate: number): PortofolioOccupancyLevel {
  if (rate >= 90) return "optimal";
  if (rate >= 75) return "correct";
  return "faible";
}

/** Derives the four cards from the properties, so they always match the list. */
export function computePortofolioKpis(biens: PortofolioBien[], revenueHistory: number[]): PortofolioKpis {
  let amount = 0;
  let total = 0;
  let occupied = 0;
  let available = 0;
  const works: NonNullable<PortofolioBien["works"]>[] = [];

  for (const bien of biens) {
    total += bien.units.total;
    occupied += bien.units.occupied;
    if (bien.status === "loue") amount += bien.rent;
    if (bien.status === "en_travaux") {
      if (bien.works) works.push(bien.works);
    } else {
      available += bien.units.total - bien.units.occupied;
    }
  }

  const previous = revenueHistory.at(-1);
  const ratePercent = total === 0 ? 0 : (occupied / total) * 100;
  const next = works.toSorted((a, b) => a.deliveryInDays - b.deliveryInDays)[0];

  return {
    revenue: {
      amount,
      deltaPercent: previous ? ((amount - previous) / previous) * 100 : null,
      history: [...revenueHistory, amount],
      activeUnits: total,
    },
    occupancy: { occupied, total, ratePercent, level: occupancyLevel(ratePercent) },
    availability: { available },
    maintenance: {
      count: biens.filter((bien) => bien.status === "en_travaux").length,
      nextDeliveryInDays: next?.deliveryInDays ?? null,
      progressPercent: next?.progressPercent ?? null,
    },
  };
}

export function usePortofolioKpis(biens: PortofolioBien[], revenueHistory: number[]) {
  return computePortofolioKpis(biens, revenueHistory);
}
