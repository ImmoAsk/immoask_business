import type { Metadata } from "next";
import { Maintenances } from "@/features/maintenances";

export const metadata: Metadata = {
  title: "Maintenances — ImmoAsk Business",
};

export default function MaintenancesPage() {
  return <Maintenances />;
}
