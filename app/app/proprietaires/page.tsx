import type { Metadata } from "next";
import { Proprietaires } from "@/features/proprietaires";

export const metadata: Metadata = {
  title: "Propriétaires — ImmoAsk Business",
};

export default function ProprietairesPage() {
  return <Proprietaires />;
}
