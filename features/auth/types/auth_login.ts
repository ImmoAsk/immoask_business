export type LoginCredentials = {
  email: string;
  password: string;
  /** Keep the session after the browser closes. */
  remember: boolean;
};

export type LoginField = "email" | "password";

export type LoginFieldErrors = Partial<Record<LoginField, string>>;

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: "proprietaire" | "gestionnaire" | "agent";
};

export type LoginResult =
  | { ok: true; user: AuthUser }
  | { ok: false; error: "invalid_credentials" | "network" };

export type LoginStatus = "idle" | "submitting" | "success";
