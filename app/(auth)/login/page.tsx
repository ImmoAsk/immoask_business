import type { Metadata } from "next";
import { LoginScreen } from "@/features/auth";

export const metadata: Metadata = {
  title: "Connexion — ImmoAsk Business",
  description: "Connectez-vous à votre espace ImmoAsk Business.",
};

export default function LoginPage() {
  return <LoginScreen />;
}
