import type { Metadata } from "next";
import { LandingPageLocalized } from "@/features/landing_page";

export const metadata: Metadata = {
  title: "ImmoAsk Business — Gérez plus intelligemment, où que vous soyez",
  description:
    "Gestion locative pour les propriétaires, la diaspora et les professionnels de l'immobilier : Mobile Money, quittances WhatsApp, virements automatiques.",
};

export default function Home() {
  return <LandingPageLocalized />;
}
