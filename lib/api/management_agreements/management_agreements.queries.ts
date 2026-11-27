/**
 * Management agreements ("contrats de gestion") by status, ordered by id.
 * - Super admin (role id 1200): only `statut` is sent → every agreement with that status.
 * - Other roles: `statut` + `gestionnaire_id` and/or `proprietaire_id`.
 * A user-id variable left out of the request is not applied as a filter.
 */
export const GET_MANAGEMENT_AGREEMENTS_BY_USER_QUERY = `
  query GetManagementAgreementsByUser($statut: Int!, $gestionnaire_id: Int, $proprietaire_id: Int) {
    getContratGestionByKeyWords(statut: $statut, gestionnaire_id: $gestionnaire_id, proprietaire_id: $proprietaire_id) {
      id
      numero_contrat
      mode_renumeration
      taux_gestion
      montant_fixe
      date_signature
      date_debut
      date_fin
      statut
      document
      observation
      compte_bancaire_iban
      gestionnaire {
        id
        name
        email
        phone
        avatar
      }
      proprietaire {
        id
        name
        email
        phone
        avatar
      }
      proprietes {
        id
        statut
        date_affectation
        date_retrait
        propriete {
          id
          titre
          nuo
          cout_mensuel
          quartier {
            id
            denomination
          }
          ville {
            id
            denomination
          }
        }
      }
    }
  }
`;
