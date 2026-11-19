import type { Metadata } from "next";
import { LandingPageLocalized } from "@/features/landing_page";

export const metadata: Metadata = {
  title: "ImmoAsk Business — Votre patrimoine immobilier mérite une gestion plus intelligente",
  description:
    "La gestion immobilière intelligente, où que vous soyez. La solution pensée pour les propriétaires de la diaspora et les professionnels de l'immobilier ambitieux.",
};

export default function Home() {
  return <LandingPageLocalized />;
}
