import type { Metadata } from "next";
import { Calendriers } from "@/features/calendriers";

export const metadata: Metadata = {
  title: "Calendrier de disponibilité — ImmoAsk Business",
};

export default function CalendriersPage() {
  return <Calendriers />;
}
