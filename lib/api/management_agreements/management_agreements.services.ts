import { graphqlRequest, type GraphQLRequestOptions } from "../graphql_client";
import {
  definedVariables,
  isSuperAdminRole,
  memoByKey,
  userCacheKey,
  userIdFieldOf,
  type RoleId,
  type ScopedUser,
} from "../shared/roles";
import { GET_MANAGEMENT_AGREEMENTS_BY_USER_QUERY } from "./management_agreements.queries";
import {
  CONTRAT_GESTION_STATUT_ACTIF,
  type ManagementAgreementItem,
  type ManagementAgreementsFilters,
} from "./management_agreements.types";

export type * from "./management_agreements.types";

/**
 * Management agreements for the signed-in role, ordered by id.
 * - Super admin (role id 1200): only `statut` is sent → every agreement with that status.
 * - Any other role: `statut` + the given `gestionnaire_id` / `proprietaire_id`.
 */
export async function getManagementAgreementsByUser(
  roleId: RoleId,
  { statut, gestionnaire_id, proprietaire_id }: ManagementAgreementsFilters,
  options: GraphQLRequestOptions = {},
): Promise<ManagementAgreementItem[]> {
  const variables: ManagementAgreementsFilters = isSuperAdminRole(roleId)
    ? { statut }
    : { statut, ...definedVariables({ gestionnaire_id, proprietaire_id }) };
  const data = await graphqlRequest<
    { getContratGestionByKeyWords: ManagementAgreementItem[] | null },
    ManagementAgreementsFilters
  >(GET_MANAGEMENT_AGREEMENTS_BY_USER_QUERY, variables, options);
  return data.getContratGestionByKeyWords ?? [];
}

const agreementsCache = memoByKey<ManagementAgreementItem[]>();

/**
 * The signed-in user's active management agreements (statut 1), shared by the header and every screen.
 * A delegate (delegue_gestion_id) has no filter on this query, so gets none rather than everyone's.
 */
export function getManagementAgreementsForUser(
  user: ScopedUser,
): Promise<ManagementAgreementItem[]> {
  return agreementsCache(userCacheKey(user), async () => {
    const field = userIdFieldOf(user);
    if (field === "delegue_gestion_id") return [];
    return getManagementAgreementsByUser(user.role?.id, {
      statut: CONTRAT_GESTION_STATUT_ACTIF,
      ...(field ? { [field]: Number(user.id) } : {}),
    });
  });
}
