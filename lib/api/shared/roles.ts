// Role helpers shared by every API domain whose queries depend on the signed-in role.

/** Role id of the super admin: sees every row, so role-scoped filters (user ids) are not sent. */
export const SUPER_ADMIN_ROLE_ID = "1200";

export type RoleId = string | number | null | undefined;

/** True when the role is the super admin's (role id 1200). */
export function isSuperAdminRole(roleId: RoleId): boolean {
  return roleId != null && String(roleId) === SUPER_ADMIN_ROLE_ID;
}

/** Keeps only the variables that were given: a variable left out is not applied as an `@eq` filter by the backend. */
export function definedVariables<T extends Record<string, unknown>>(
  variables: T,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(variables).filter(([, value]) => value != null),
  ) as Partial<T>;
}

// ─── Which id filter a signed-in user's queries send ───────────────────────

/** The id argument a role-scoped query filters on with the signed-in user's id. */
export type UserIdField =
  "gestionnaire_id" | "proprietaire_id" | "delegue_gestion_id";

/** The parts of the signed-in user the queries need. */
export type ScopedUser = {
  id: string;
  role: { id: string; name: string | null } | null;
};

/**
 * Role id → id filter, for the roles known by id. Roles not listed here are matched by name
 * ("Propriétaire" → proprietaire_id, "Délégué…" → delegue_gestion_id), and default to gestionnaire_id.
 */
export const ROLE_USER_ID_FIELD: Record<string, UserIdField> = {};

const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

/** Which id the user's role filters on, or null for the super admin (no user filter at all). */
export function userIdFieldOf(user: ScopedUser): UserIdField | null {
  if (isSuperAdminRole(user.role?.id)) return null;
  const known = user.role ? ROLE_USER_ID_FIELD[user.role.id] : undefined;
  if (known) return known;
  const name = normalize(user.role?.name ?? "");
  if (name.includes("proprietaire") || name.includes("bailleur"))
    return "proprietaire_id";
  if (name.includes("delegu")) return "delegue_gestion_id";
  return "gestionnaire_id";
}

/** Memoises one promise per key (e.g. per user), so screens and the header share a single request. */
export function memoByKey<T>() {
  const cache = new Map<string, Promise<T>>();
  return (key: string, load: () => Promise<T>): Promise<T> => {
    const cached = cache.get(key);
    if (cached) return cached;
    // A failed request is forgotten, so the next screen retries.
    const promise = load().catch((error: unknown) => {
      cache.delete(key);
      throw error;
    });
    cache.set(key, promise);
    return promise;
  };
}

export const userCacheKey = (user: ScopedUser) =>
  `${user.id}:${user.role?.id ?? ""}`;
