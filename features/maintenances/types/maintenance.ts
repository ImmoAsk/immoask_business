/** Workflow of a request: "nouvelle" (to handle) → "en_traitement" (work under way) → "resolue". */
export type MaintenanceStatus = "nouvelle" | "en_traitement" | "resolue";

export type MaintenanceCategory = "plomberie" | "electricite" | "climatisation" | "serrurerie" | "peinture" | "toiture";

/** A repair request on a managed property. */
export type Maintenance = {
  id: string;
  /** "MT-2026-0201" */
  reference: string;
  description: string;
  category: MaintenanceCategory;
  /** "Appartement A4 · Résidence Les Palmiers" */
  property: string;
  /** ISO "YYYY-MM-DD". */
  createdAt: string;
  status: MaintenanceStatus;
};
