import type { Metadata } from "next";
import { Comptabilites } from "@/features/comptabilites";

export const metadata: Metadata = {
  title: "Comptabilité — ImmoAsk Business",
};

export default function ComptabilitesPage() {
  return <Comptabilites />;
}
