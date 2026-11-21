import type { ProprietaireMandateType, ProprietaireReversementStatus } from "./proprietaire";

/** Chips above the list. */
export type ProprietaireQuickFilter = "tous" | "actifs" | "a_reverser" | "diaspora" | "mandat_simple" | "fin_mandat";

export type ProprietaireFilters = {
  reversement: ProprietaireReversementStatus | "tous";
  mandate: ProprietaireMandateType | "tous";
  /** Commune of at least one property, or "tous". */
  commune: string;
};

export type ProprietaireView = "tableau" | "carte";

export type ProprietaireOption<T extends string = string> = { value: T; label: string; count?: number };
