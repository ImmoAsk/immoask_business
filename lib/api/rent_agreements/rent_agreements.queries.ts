/**
 * Leases ("contrats de location") by status, ordered by id.
 * - Super admin (role id 1200): only `statut` is sent → every lease with that status.
 * - Owner: `statut` + `proprietaire_id`; `locataire_id` / `contrat_gestion_id` narrow further when given.
 * A variable left out of the request is not applied as a filter.
 */
export const GET_RENT_AGREEMENTS_BY_USER_QUERY = `
  query GetContratLocationByUser($statut: Int!, $locataire_id: Int, $contrat_gestion_id: Int, $proprietaire_id: Int) {
    getContractsByKeyWords(
      statut: $statut
      locataire_id: $locataire_id
      contrat_gestion_id: $contrat_gestion_id
      proprietaire_id: $proprietaire_id
    ) {
      id
      date_debut
      date_fin
      montant_final
      type_contrat
      statut
      propriete {
        id
        titre
        nuo
        usage
        cout_mensuel
        caution_avance
        categorie_propriete {
          id
          denomination
        }
        quartier {
          id
          denomination
        }
        ville {
          id
          denomination
        }
      }
      proprietaire {
        id
        name
        email
        phone
        avatar
      }
      locataire {
        id
        name
        email
        phone
        avatar
      }
      contrat_gestion {
        id
        numero_contrat
        observation
        proprietaire {
          id
          name
        }
        gestionnaire {
          id
          name
        }
      }
    }
  }
`;
