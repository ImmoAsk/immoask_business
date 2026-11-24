import { daysBetween } from "@/lib/utils/dates";
import type { Reservation, ReservationKpis } from "../types";
import { DEPARTURE_WINDOW_DAYS, stayNights } from "./reservations_stay";

/** Derives the four cards from the reservations, so they always match the table. */
export function computeReservationsKpis(reservations: Reservation[], asOf: string, newHistory: number[]): ReservationKpis {
  const byStatus = (status: Reservation["status"]) => reservations.filter((reservation) => reservation.status === status);
  const newOnes = byStatus("nouvelle");
  const inProgress = byStatus("en_cours");
  const done = byStatus("effectuee");
  const properties = new Set(reservations.map((reservation) => reservation.property)).size;
  const occupied = new Set(inProgress.map((reservation) => reservation.property)).size;

  return {
    newOnes: { count: newOnes.length, total: reservations.length, history: [...newHistory, newOnes.length] },
    inProgress: {
      count: inProgress.length,
      occupied,
      properties,
      occupiedPercent: properties === 0 ? 0 : (occupied / properties) * 100,
    },
    departures: {
      count: inProgress.filter((reservation) => {
        const days = daysBetween(asOf, reservation.departure);
        return days >= 0 && days <= DEPARTURE_WINDOW_DAYS;
      }).length,
      withinDays: DEPARTURE_WINDOW_DAYS,
    },
    done: { count: done.length, nights: done.reduce((sum, reservation) => sum + stayNights(reservation), 0) },
  };
}

export function useReservationsKpis(reservations: Reservation[], asOf: string, newHistory: number[]) {
  return computeReservationsKpis(reservations, asOf, newHistory);
}
