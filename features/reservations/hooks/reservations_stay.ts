import { daysBetween } from "@/lib/utils/dates";
import type { Reservation, ReservationStatus } from "../types";

export function stayNights(reservation: Reservation) {
  return daysBetween(reservation.arrival, reservation.departure);
}

/** Commission as a share of the stay's price, %. */
export function commissionPercent(reservation: Reservation) {
  return reservation.amount === 0 ? 0 : (reservation.commission / reservation.amount) * 100;
}

/** The step the main action moves a reservation to; null once the stay is over. */
export function nextStatus(status: ReservationStatus): ReservationStatus | null {
  return status === "nouvelle" ? "en_cours" : status === "en_cours" ? "effectuee" : null;
}

/** Window for the "Départs à venir" card. */
export const DEPARTURE_WINDOW_DAYS = 7;
