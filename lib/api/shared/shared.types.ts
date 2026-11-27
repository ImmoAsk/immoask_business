// Scalars and location types shared by every API domain.
//
// Conventions for all `*.types.ts` files in lib/api:
// - Type names match the backend GraphQL schema (Propriete, Categorie_propriete…), so queries and types read alike.
// - A nullable GraphQL field is `T | null`; a non-null one (`!`) is `T`.
// - A query only returns the fields it selects: type a query result with `Pick<…>` (see `LoginUser` in accounts).
// - GraphQL enums travel by name ("Logement"), not by their Laravel value; the `*_VALUES` maps give the numbers.

/** GraphQL `ID`: always serialized as a string. */
export type ID = string;

/** Laravel / Lighthouse `DateTime`: "YYYY-MM-DD HH:mm:ss" string. */
export type DateTime = string;

/** Laravel / Lighthouse `Date`: "YYYY-MM-DD" string. (Not named `Date`, which would shadow the JS global.) */
export type DateString = string;

/** Country where a property is located. */
export type Pays = {
  id: ID;
  code: string;
  monnaie: string;
  denomination: string;
  villes: Ville[];
};

export type Ville = {
  id: ID;
  code: string | null;
  minus_denonimation: string | null;
  lat_long: string | null;
  histoire: string | null;
  denomination: string;
  url_wikipedia: string | null;
  pays: Pays;
  quartiers: Quartier[];
};

export type Quartier = {
  id: ID;
  code: string | null;
  minus_denonimation: string | null;
  lat_long: string | null;
  histoire: string | null;
  denomination: string;
  url_wikipedia: string | null;
  ville: Ville;
  adresses: Adresse[];
};

export type Adresse = {
  id: ID;
  libelle: string | null;
  lat_long: string | null;
  quartier: Quartier;
};
