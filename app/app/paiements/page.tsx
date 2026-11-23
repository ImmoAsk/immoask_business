import type { Metadata } from "next";
import { RentPayments } from "@/features/rent_payments";

export const metadata: Metadata = {
  title: "Paiements de loyer — ImmoAsk Business",
};

export default function PaiementsPage() {
  return <RentPayments />;
}
