import { graphqlRequest, type GraphQLRequestOptions } from "../graphql_client";
import { GET_PORTOFOLIO_PROPERTIES_QUERY } from "./portofolios.queries";
import {
  definedVariables,
  isSuperAdminRole,
  memoByKey,
  SUPER_ADMIN_ROLE_ID,
  userCacheKey,
  userIdFieldOf,
  type RoleId,
  type ScopedUser,
} from "../shared/roles";
import type {
  PortofolioPropertiesFilters,
  PortofolioPropertyItem,
} from "./portofolios.types";

export type * from "./portofolios.types";

export { isSuperAdminRole } from "../shared/roles";

/**
 * Portfolio properties for the signed-in role.
 * - Super admin (role id 1200): sent without arguments, `filters` is ignored → every portfolio.
 * - Any other role: sent with the given filters (proprietaire_id, gestionnaire_id, delegue_gestion_id, statut).
 */
export async function getPortofolioProperties(
  roleId: RoleId,
  filters: PortofolioPropertiesFilters = {},
  options: GraphQLRequestOptions = {},
): Promise<PortofolioPropertyItem[]> {
  const variables = isSuperAdminRole(roleId)
    ? undefined
    : definedVariables(filters);
  const data = await graphqlRequest<
    { getPortofolioPropertyByUserID: PortofolioPropertyItem[] | null },
    PortofolioPropertiesFilters
  >(GET_PORTOFOLIO_PROPERTIES_QUERY, variables, options);
  return data.getPortofolioPropertyByUserID ?? [];
}

// ─── One helper per case (same query underneath) ────────────────────────────

/** Every portfolio, no argument sent. Only meaningful for the super admin (role id 1200). */
export const getPortofolioPropertiesBySuperAdmin = (
  options?: GraphQLRequestOptions,
) => getPortofolioProperties(SUPER_ADMIN_ROLE_ID, {}, options);

/** Portfolios owned by `proprietaire_id`. */
export const getPortofolioPropertiesByProprietaire = (
  proprietaire_id: number,
  statut?: number,
  options?: GraphQLRequestOptions,
) => getPortofolioProperties(null, { proprietaire_id, statut }, options);

/** Portfolios managed by `gestionnaire_id`. */
export const getPortofolioPropertiesByGestionnaire = (
  gestionnaire_id: number,
  statut?: number,
  options?: GraphQLRequestOptions,
) => getPortofolioProperties(null, { gestionnaire_id, statut }, options);

/** Portfolios delegated to `delegue_gestion_id`. */
export const getPortofolioPropertiesByDelegueGestion = (
  delegue_gestion_id: number,
  statut?: number,
  options?: GraphQLRequestOptions,
) => getPortofolioProperties(null, { delegue_gestion_id, statut }, options);

const portofolioCache = memoByKey<PortofolioPropertyItem[]>();

/**
 * The signed-in user's portfolio: everything for the super admin, otherwise filtered on the id
 * the role stands for (see `userIdFieldOf`). One request per user, shared by every screen.
 */
export function getPortofolioPropertiesForUser(
  user: ScopedUser,
): Promise<PortofolioPropertyItem[]> {
  return portofolioCache(userCacheKey(user), () => {
    const field = userIdFieldOf(user);
    return getPortofolioProperties(
      user.role?.id,
      field ? { [field]: Number(user.id) } : {},
    );
  });
}
