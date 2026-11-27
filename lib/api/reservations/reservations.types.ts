// Reservations (short stays) of properties.
import type { User } from "../accounts/accounts.types";
import type { Propriete } from "../properties/properties.types";
import type { ID } from "../shared/shared.types";

/**
 * A booking of a property. `client` is set when the guest has an account;
 * otherwise the `*_reservateur` fields describe the person who booked.
 */
export type Reservation = {
  id: ID;
  date_arrive: string;
  date_depart: string;
  propriete: Propriete;
  client: User | null;
  pickup_place: string | null;
  email_reservateur: string | null;
  phone_reservateur: string | null;
  fullname_reservateur: string | null;
  proprietaire: User | null;
  statut: number | null;
  /** Number of adults. */
  adulte: number | null;
  /** Number of children. */
  enfant: number | null;
};
