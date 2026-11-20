import type { PortofolioBienStatus, PortofolioBienType } from "./portofolio_bien";

export type PortofolioPriceRange =
  | "toutes"
  | "moins_100k"
  | "100k_300k"
  | "300k_700k"
  | "plus_700k";

export type PortofolioFilters = {
  type: PortofolioBienType | "tous";
  city: string;
  status: PortofolioBienStatus | "tous";
  price: PortofolioPriceRange;
};

export type PortofolioSort = "pertinence" | "loyer_desc" | "loyer_asc" | "titre";

export type PortofolioView = "tableau" | "carte";

export type PortofolioOption<T extends string = string> = { value: T; label: string };
