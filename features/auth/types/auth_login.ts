export type LoginCredentials = {
  email: string;
  password: string;
  /** Keep the session after the browser closes. */
  remember: boolean;
};

export type LoginField = "email" | "password";

export type LoginFieldErrors = Partial<Record<LoginField, string>>;

export type AuthRole = {
  id: string;
  /** Backend role code (e.g. used for permissions). */
  code: string | null;
  name: string | null;
};

export type AuthUser = {
  id: string;
  email: string | null;
  fullName: string;
  phone: string | null;
  avatar: string | null;
  role: AuthRole | null;
};

export type LoginResult =
  | { ok: true; user: AuthUser }
  | { ok: false; error: "invalid_credentials" | "network" };

export type LoginStatus = "idle" | "submitting" | "success";
