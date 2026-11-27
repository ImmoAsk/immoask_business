// Types mirroring the backend GraphQL schema for accounts (login / logout / refresh).

export type LoginInput = {
  username: string;
  password: string;
};

export type RefreshTokenInput = {
  refresh_token?: string | null;
};

export type ApiRole = {
  id: string;
  description?: string | null;
  statut?: string | null;
  code?: string | null;
  roleName?: string | null;
};

export type ApiUser = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  avatar?: string | null;
  adresse?: string | null;
  created_at?: string | null;
  role?: ApiRole | null;
};

export type AuthPayload = {
  access_token: string | null;
  refresh_token: string | null;
  expires_in: number | null;
  token_type: string | null;
  user: ApiUser;
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
