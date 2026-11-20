import type { Metadata } from "next";
import { Portofolios } from "@/features/portofolios";

export const metadata: Metadata = {
  title: "Portofolio — ImmoAsk Business",
};

export default function PortofolioPage() {
  return <Portofolios />;
}
