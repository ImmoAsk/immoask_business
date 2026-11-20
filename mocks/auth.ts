import type { AuthUser } from "@/features/auth/types";

// Demo account for local development, until the auth API exists.
export const mockDemoAccount = {
  email: "demo@immoask.com",
  password: "ImmoAsk2025!",
} as const;

export const mockDemoUser: AuthUser = {
  id: "usr_demo",
  email: mockDemoAccount.email,
  fullName: "Kossi Adanou",
  role: "proprietaire",
};
