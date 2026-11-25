"use client";

import { useWorkspaceScope } from "@/features/workspace/hooks";
import type { Reservation } from "../types";

/** The header's contract and period: stays in that contract's properties overlapping the month. */
export function useReservationsInScope(reservations: Reservation[]) {
  const scope = useWorkspaceScope();
  return reservations.filter((reservation) => scope.matchesProperty(reservation.property) && scope.overlapsPeriod(reservation.arrival, reservation.departure));
}
