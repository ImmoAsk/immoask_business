import type { Reservation } from "./reservation";

export type * from "./reservation";
export type * from "./reservation_filters";
export type * from "./reservation_kpi";

/** Everything the reservations page loads. */
export type ReservationsData = {
  /** Today, ISO "YYYY-MM-DD". */
  asOf: string;
  reservations: Reservation[];
  /** New reservations at the end of the previous weeks, oldest first. */
  newHistory: number[];
};
