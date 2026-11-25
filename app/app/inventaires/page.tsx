import type { Metadata } from "next";
import { EtatLieux } from "@/features/etat_lieux";

export const metadata: Metadata = {
  title: "Inventaires — ImmoAsk Business",
};

export default function InventairesPage() {
  return <EtatLieux />;
}
