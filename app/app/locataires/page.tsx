import type { Metadata } from "next";
import { Locataires } from "@/features/locataires";

export const metadata: Metadata = {
  title: "Locataires — ImmoAsk Business",
};

export default function LocatairesPage() {
  return <Locataires />;
}
