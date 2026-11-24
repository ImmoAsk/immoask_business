import type { ReservationStatus } from "./reservation";

/** Status tabs above the table. */
export type ReservationTab = "toutes" | ReservationStatus;

export type ReservationFilters = {
  property: string;
  owner: string;
  manager: string;
  /** "Lieu de prise" chips in the extra filters. */
  pickup: string;
};

export type ReservationOption<T extends string = string> = { value: T; label: string };
