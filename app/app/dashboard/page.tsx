import type { Metadata } from "next";
import { Dashboard } from "@/features/dashboard";

export const metadata: Metadata = {
  title: "Tableau de bord — ImmoAsk Business",
};

export default function DashboardPage() {
  return <Dashboard />;
}
