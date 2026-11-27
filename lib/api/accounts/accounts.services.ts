import { graphqlRequest, type GraphQLRequestOptions } from "../graphql_client";
import { LOGIN_ACCOUNT_MUTATION, LOGOUT_ACCOUNT_MUTATION } from "./accounts.queries";
import type { AuthPayload, LoginInput, LogoutResponse } from "./accounts.types";

export type * from "./accounts.types";

/** Signs in with username (e-mail or phone) + password. Sent without any stored token. */
export async function loginAccount(input: LoginInput, options: Omit<GraphQLRequestOptions, "token"> = {}): Promise<AuthPayload> {
  const data = await graphqlRequest<{ login: AuthPayload }, { input: LoginInput }>(LOGIN_ACCOUNT_MUTATION, { input }, { ...options, token: null });
  return data.login;
}

/** Revokes the current access token on the backend. Uses the stored session token unless `options.token` is given. */
export async function logoutAccount(options: GraphQLRequestOptions = {}): Promise<LogoutResponse> {
  const data = await graphqlRequest<{ logout: LogoutResponse }>(LOGOUT_ACCOUNT_MUTATION, undefined, options);
  return data.logout;
}
