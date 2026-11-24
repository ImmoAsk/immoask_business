"use client";

import { useState } from "react";
import type { Reservation } from "../types";
import { nextStatus } from "./reservations_stay";

/**
 * Reservations, moved along by check-in and check-out.
 * Kept in memory for now: wire `advance` to lib/api/reservations once the API exists.
 */
export function useReservationsStore(initial: Reservation[]) {
  const [reservations, setReservations] = useState(initial);
  return {
    reservations,
    /** Check-in a new reservation, or check-out a stay in progress. */
    advance: (reservationId: string) =>
      setReservations((previous) =>
        previous.map((reservation) => {
          const next = reservation.id === reservationId ? nextStatus(reservation.status) : null;
          return next ? { ...reservation, status: next } : reservation;
        }),
      ),
  };
}

export type UseReservationsStoreResult = ReturnType<typeof useReservationsStore>;
