import type { Metadata } from "next";
import { Versements } from "@/features/versements";

export const metadata: Metadata = {
  title: "Versements — ImmoAsk Business",
};

export default function VersementsPage() {
  return <Versements />;
}
