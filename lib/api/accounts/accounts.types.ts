// Accounts: users, organisations, roles and their resources, plus login / logout / refresh payloads.
import type { DateTime, ID } from "../shared/shared.types";

/** Account of a person who uses the application. */
export type User = {
  id: ID;
  /** Non-unique name. */
  name: string;
  /** Unique email address. */
  email: string;
  email_verified_at: DateTime | null;
  created_at: DateTime;
  updated_at: DateTime;
  phone: string | null;
  avatar: string | null;
  adresse: string | null;
  /** Field argument: `organisation(organisation_id: Int)`. */
  organisation: Organisation | null;
  /** Field argument: `role(role_id: Int)`. */
  role: Role | null;
};

export type Organisation = {
  id: ID;
  proprietaire: User;
  name_organisation: string | null;
  description: string | null;
  tel_whatsapp: string | null;
  tel_portable: string | null;
  category: number | null;
  status: number | null;
  logo: string | null;
  facebook_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  youtube_url: string | null;
  longitude: number | null;
  latitude: number | null;
  adresse_commune: string | null;
};

export type Role = {
  id: ID;
  roleName: string | null;
  code: number | null;
  description: string | null;
  statut: number | null;
  ressources: Ressource[];
};

/** An app resource (screen / feature) a role grants access to. */
export type Ressource = {
  id: ID;
  ressourceName: string | null;
  ressourceLink: string | null;
  icone: string | null;
  statut: number | null;
  roles: Role[];
};

export type Ressource_role = {
  id: ID;
  ressource: Ressource;
  role: Role;
};

export type Project = {
  id: ID;
  user_id: number | null;
  final_date: string | null;
  description: string | null;
  project_name: string | null;
  project_category: string | null;
};

// ─── Auth inputs and payloads ───────────────────────────────────────────────

export type LoginInput = {
  username: string;
  password: string;
};

export type RefreshTokenInput = {
  refresh_token?: string | null;
};

/** The user fields selected by LOGIN_ACCOUNT_MUTATION. */
export type LoginUser = Pick<User, "id" | "name" | "email" | "phone" | "avatar"> & {
  role: Pick<Role, "id" | "description" | "statut" | "code" | "roleName"> | null;
};

export type AuthPayload = {
  access_token: string | null;
  refresh_token: string | null;
  expires_in: number | null;
  token_type: string | null;
  user: LoginUser;
};

export type RefreshTokenPayload = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
};

export type LogoutResponse = {
  status: string;
  message: string | null;
};
