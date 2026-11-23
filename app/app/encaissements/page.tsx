import type { Metadata } from "next";
import { RentCollections } from "@/features/rent_collections";

export const metadata: Metadata = {
  title: "Encaissements — ImmoAsk Business",
};

export default function EncaissementsPage() {
  return <RentCollections />;
}
