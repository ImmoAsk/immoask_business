import type { Metadata } from "next";
import { Calendries } from "@/features/calendries";

export const metadata: Metadata = {
  title: "Calendrier de disponibilité — ImmoAsk Business",
};

export default function CalendriersPage() {
  return <Calendries />;
}
