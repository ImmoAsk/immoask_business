import type { LoginCredentials, LoginResult } from "@/features/auth/types";
import { mockDemoAccount, mockDemoUser } from "@/mocks/auth";

/**
 * Email + password sign-in.
 * Mock implementation: accepts the demo account only. Replace the body with the
 * real API call (and session cookie handling) once the backend exists.
 */
export async function loginWithPassword({ email, password }: LoginCredentials): Promise<LoginResult> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  const matches =
    email.trim().toLowerCase() === mockDemoAccount.email && password === mockDemoAccount.password;
  return matches ? { ok: true, user: mockDemoUser } : { ok: false, error: "invalid_credentials" };
}
