import type { Metadata } from "next";
import { RentAgreements } from "@/features/rent_agreements";

export const metadata: Metadata = {
  title: "Contrats de location — ImmoAsk Business",
};

export default function ContratsLocationPage() {
  return <RentAgreements />;
}
