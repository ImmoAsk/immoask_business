import type { Metadata } from "next";
import { LoginScreen } from "@/features/auth";
import { mockDemoAccount } from "@/mocks/auth";

export const metadata: Metadata = {
  title: "Connexion — ImmoAsk Business",
  description: "Connectez-vous à votre espace ImmoAsk Business.",
};

export default function LoginPage() {
  // The demo credentials are only shown in development, while sign-in is mocked.
  const demoHint = process.env.NODE_ENV === "development" ? mockDemoAccount : undefined;
  return <LoginScreen demoHint={demoHint} />;
}
