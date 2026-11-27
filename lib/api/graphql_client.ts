import { clearSession, getAccessToken } from "@/lib/auth/session";
import { API_URL } from "./config";

/** One entry of a GraphQL `errors` array (Laravel Lighthouse adds `extensions.category`, `extensions.validation`…). */
export type GraphQLErrorItem = {
  message: string;
  path?: (string | number)[];
  extensions?: Record<string, unknown> & { category?: string };
};

type GraphQLResponse<TData> = {
  data?: TData | null;
  errors?: GraphQLErrorItem[];
};

/**
 * Thrown by `graphqlRequest` when the request fails.
 * - `kind: "network"`: the server could not be reached or answered with a non-JSON / HTTP error.
 * - `kind: "graphql"`: the server answered with GraphQL `errors` (validation, authentication, business rules…).
 */
export class GraphQLRequestError extends Error {
  readonly kind: "network" | "graphql";
  readonly status?: number;
  readonly errors: GraphQLErrorItem[];

  constructor(kind: "network" | "graphql", message: string, options: { status?: number; errors?: GraphQLErrorItem[]; cause?: unknown } = {}) {
    super(message, { cause: options.cause });
    this.name = "GraphQLRequestError";
    this.kind = kind;
    this.status = options.status;
    this.errors = options.errors ?? [];
  }

  /** True when the backend rejected the request for missing / invalid credentials. */
  get isAuthenticationError() {
    return this.status === 401 || this.errors.some((error) => error.extensions?.category === "authentication");
  }
}

export type GraphQLRequestOptions = {
  /**
   * Bearer token to send. Defaults to the token of the stored session (browser only).
   * Pass `null` to send the request without an Authorization header (e.g. login).
   */
  token?: string | null;
  signal?: AbortSignal;
  headers?: HeadersInit;
};

/** Sends a query or mutation to the ImmoAsk GraphQL API and returns its `data`. */
export async function graphqlRequest<TData, TVariables extends Record<string, unknown> = Record<string, never>>(
  query: string,
  variables?: TVariables,
  { token, signal, headers }: GraphQLRequestOptions = {},
): Promise<TData> {
  const bearer = token === undefined ? getAccessToken() : token;

  let response: Response;
  try {
    response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
        ...headers,
      },
      body: JSON.stringify({ query, variables: variables ?? {} }),
      signal,
    });
  } catch (cause) {
    throw new GraphQLRequestError("network", "Unable to reach the API.", { cause });
  }

  let payload: GraphQLResponse<TData>;
  try {
    payload = (await response.json()) as GraphQLResponse<TData>;
  } catch (cause) {
    if (token === undefined && bearer && response.status === 401) clearSession();
    throw new GraphQLRequestError("network", `Invalid API response (HTTP ${response.status}).`, { status: response.status, cause });
  }

  if (payload.errors?.length || !response.ok) {
    const error = payload.errors?.length
      ? new GraphQLRequestError("graphql", payload.errors[0].message, { status: response.status, errors: payload.errors })
      : new GraphQLRequestError("network", `API request failed (HTTP ${response.status}).`, { status: response.status });
    // The stored token was refused (expired or revoked): sign out so the app sends the user back to /login.
    if (token === undefined && bearer && error.isAuthenticationError) clearSession();
    throw error;
  }
  if (payload.data == null) {
    throw new GraphQLRequestError("network", `API request failed (HTTP ${response.status}).`, { status: response.status });
  }
  return payload.data;
}
