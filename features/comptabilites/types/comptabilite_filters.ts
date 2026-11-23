import type { ComptabiliteCategory, ComptabiliteFlow, ComptabiliteStatus } from "./comptabilite_operation";

export type ComptabilitePeriod = "mois" | "15_jours" | "7_jours";

export type ComptabiliteFilters = {
  flow: ComptabiliteFlow | "tous";
  category: ComptabiliteCategory | "tous";
  period: ComptabilitePeriod;
};

/** "Filtres avancés" panel. */
export type ComptabiliteAdvancedFilters = {
  status: ComptabiliteStatus | "tous";
  bien: string;
  /** FCFA; null = no bound. */
  minAmount: number | null;
  maxAmount: number | null;
};

export type ComptabiliteSort = { key: "date" | "amount"; direction: "asc" | "desc" };

export type ComptabiliteView = "tableau" | "graphique";

/** Months shown in the overview chart. */
export type ComptabiliteChartRange = 3 | 5 | 12;

export type ComptabiliteOption<T extends string = string> = { value: T; label: string };
