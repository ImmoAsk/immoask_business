import type { Metadata } from "next";
import { Reservations } from "@/features/reservations";

export const metadata: Metadata = {
  title: "Réservations — ImmoAsk Business",
};

export default function ReservationsPage() {
  return <Reservations />;
}
