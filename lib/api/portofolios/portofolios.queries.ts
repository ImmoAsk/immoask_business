/**
 * Portfolio properties, optionally filtered (each argument is an `@eq` filter on the backend).
 * - Super admin (role id 1200): sent without any variable, so every portfolio comes back.
 * - Other roles: any of statut / proprietaire_id / gestionnaire_id / delegue_gestion_id.
 * A variable left out of the request is not applied as a filter.
 */
export const GET_PORTOFOLIO_PROPERTIES_QUERY = `
  query GetPortofolioProperties($statut: Int, $proprietaire_id: Int, $gestionnaire_id: Int, $delegue_gestion_id: Int) {
    getPortofolioPropertyByUserID(
      statut: $statut
      proprietaire_id: $proprietaire_id
      gestionnaire_id: $gestionnaire_id
      delegue_gestion_id: $delegue_gestion_id
    ) {
      id
      statut
      propriete {
        id
        titre
        descriptif
        surface
        usage
        est_disponible
        cout_mensuel
        statut
        nuo
        piece
        salon
        cuisine
        etage
        garage
        wc_douche_interne
        est_meuble
        piscine
        jardin
        balcon
        gardien_securite
        cout_vente
        lat_propriete
        long_propriete
        offre {
          id
          code
          denomination
        }
        adresse {
          id
          libelle
        }
        visuels {
          id
          url
          uri
          position
          est_image
        }
        categorie_propriete {
          id
          denomination
        }
        ville {
          id
          denomination
        }
        quartier {
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
      gestionnaire {
        id
        name
        email
        phone
        avatar
      }
      delegue_gestion {
        id
        name
        email
        phone
        avatar
      }
    }
  }
`;
