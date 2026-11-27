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
import { GET_RENT_AGREEMENTS_BY_USER_QUERY } from "./rent_agreements.queries";
import {
  CONTRAT_STATUT_VALUES,
  type RentAgreementItem,
  type RentAgreementsFilters,
} from "./rent_agreements.types";

export type * from "./rent_agreements.types";

/**
 * Leases for the signed-in role, ordered by id.
 * - Super admin (role id 1200): only `statut` is sent → every lease with that status.
 * - Any other role: `statut` + the given `proprietaire_id` / `locataire_id` / `contrat_gestion_id`.
 */
export async function getContratLocationByUser(
  roleId: RoleId,
  {
    statut,
    proprietaire_id,
    locataire_id,
    contrat_gestion_id,
  }: RentAgreementsFilters,
  options: GraphQLRequestOptions = {},
): Promise<RentAgreementItem[]> {
  const variables: RentAgreementsFilters = isSuperAdminRole(roleId)
    ? { statut }
    : {
        statut,
        ...definedVariables({
          proprietaire_id,
          locataire_id,
          contrat_gestion_id,
        }),
      };
  const data = await graphqlRequest<
    { getContractsByKeyWords: RentAgreementItem[] | null },
    RentAgreementsFilters
  >(GET_RENT_AGREEMENTS_BY_USER_QUERY, variables, options);
  return data.getContractsByKeyWords ?? [];
}

const rentAgreementsCache = memoByKey<RentAgreementItem[]>();

/**
 * The signed-in user's leases, running and finished (statut 1 and 2), shared by every screen.
 * Super admin: every lease. Owner: their leases (proprietaire_id).
 * Other roles get none: this query has no manager / delegate filter, and sending none would list everyone's.
 */
export function getRentAgreementsForUser(
  user: ScopedUser,
): Promise<RentAgreementItem[]> {
  return rentAgreementsCache(userCacheKey(user), async () => {
    const field = userIdFieldOf(user);
    if (field !== null && field !== "proprietaire_id") return [];
    const filters = field ? { proprietaire_id: Number(user.id) } : {};
    const lists = await Promise.all(
      Object.values(CONTRAT_STATUT_VALUES).map((statut) =>
        getContratLocationByUser(user.role?.id, { statut, ...filters }),
      ),
    );
    return lists.flat().sort((a, b) => Number(a.id) - Number(b.id));
  });
}
