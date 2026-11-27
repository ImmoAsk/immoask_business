import type { AuthUser, LoginCredentials, LoginResult } from "@/features/auth/types";
import { loginAccount, logoutAccount, type ApiUser } from "@/lib/api/accounts/accounts.services";
import { GraphQLRequestError } from "@/lib/api/graphql_client";
import { clearSession, saveSession } from "./session";

function toAuthUser(user: ApiUser): AuthUser {
  return {
    id: user.id,
    email: user.email ?? null,
    fullName: user.name,
    phone: user.phone ?? null,
    avatar: user.avatar ?? null,
    role: user.role ? { id: user.role.id, code: user.role.code ?? null, name: user.role.roleName ?? null } : null,
  };
}

/**
 * Email + password sign-in against the backend.
 * On success the tokens and user are saved in the browser (see `./session`) until logout or expiry.
 */
export async function loginWithPassword({ email, password, remember }: LoginCredentials): Promise<LoginResult> {
  try {
    const payload = await loginAccount({ username: email, password });
    if (!payload.access_token) return { ok: false, error: "invalid_credentials" };

    const user = toAuthUser(payload.user);
    saveSession(
      {
        accessToken: payload.access_token,
        refreshToken: payload.refresh_token,
        tokenType: payload.token_type ?? "Bearer",
        expiresAt: payload.expires_in ? Date.now() + payload.expires_in * 1000 : null,
        user,
      },
      { remember },
    );
    return { ok: true, user };
  } catch (error) {
    if (error instanceof GraphQLRequestError && error.kind === "graphql") return { ok: false, error: "invalid_credentials" };
    return { ok: false, error: "network" };
  }
}

/** Revokes the token on the backend (best effort) and always clears the browser session. */
export async function logout(): Promise<void> {
  try {
    await logoutAccount();
  } catch {
    // Token already expired/revoked or network down: the local session is cleared anyway.
  } finally {
    clearSession();
  }
}
