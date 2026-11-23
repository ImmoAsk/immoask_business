import type { ComptabiliteCategory, ComptabiliteFlow } from "../types";

/** Category names and the flow each belongs to. Order = order in charts and legends. */
export const COMPTABILITE_CATEGORIES: Record<ComptabiliteCategory, { label: string; short: string; flow: ComptabiliteFlow }> = {
  loyer: { label: "Loyers", short: "Loyer", flow: "recette" },
  caution: { label: "Cautions", short: "Caution", flow: "recette" },
  charges_locatives: { label: "Charges locatives", short: "Charges loc.", flow: "recette" },
  entretien: { label: "Entretien", short: "Entretien", flow: "depense" },
  charges_communes: { label: "Charges communes", short: "Charge", flow: "depense" },
  autre: { label: "Autres", short: "Autre", flow: "depense" },
};

export const INCOME_CATEGORIES = ["loyer", "caution", "charges_locatives"] as const;
export const EXPENSE_CATEGORIES = ["entretien", "charges_communes", "autre"] as const;
