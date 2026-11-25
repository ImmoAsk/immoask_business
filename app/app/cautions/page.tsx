import type { Metadata } from "next";
import { Cautions } from "@/features/cautions";

export const metadata: Metadata = {
  title: "Cautions — ImmoAsk Business",
};

export default function CautionsPage() {
  return <Cautions />;
}
