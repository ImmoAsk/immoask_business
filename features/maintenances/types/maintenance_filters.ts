import type { MaintenanceCategory, MaintenanceStatus } from "./maintenance";

/** Status tabs above the table. */
export type MaintenanceTab = "toutes" | MaintenanceStatus;

/** "Date de création" dropdown: all, or created within the last N days. */
export type MaintenancePeriod = "tous" | "7" | "30";

export type MaintenanceFilters = {
  category: "tous" | MaintenanceCategory;
  property: string;
  period: MaintenancePeriod;
  /** "Ancienneté" chip: only requests left unresolved for STALE_DAYS or more. */
  staleOnly: boolean;
};

export type MaintenanceOption<T extends string = string> = { value: T; label: string };
