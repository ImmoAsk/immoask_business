import type { InventoryType, ItemCondition } from "./etat_lieux";

/** Condition tabs above the table. */
export type InventoryTab = "tous" | ItemCondition;

export type InventoryFilters = {
  type: "tous" | InventoryType;
  property: string;
  manager: string;
  /** "Coût de l'élément" chips in the extra filters. */
  cost: "tous" | "avec" | "sans";
};

export type InventoryOption<T extends string = string> = { value: T; label: string };
