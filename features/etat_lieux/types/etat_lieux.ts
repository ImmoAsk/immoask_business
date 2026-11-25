/** "Entrée" when the tenant moves in, "Sortie" when they leave. */
export type InventoryType = "entree" | "sortie";

/** Condition of an item, best first. */
export type ItemCondition = "excellent" | "bon" | "moyen" | "endommage";

export type ItemKind = "mobilier" | "electromenager" | "climatisation" | "literie" | "menuiserie" | "murs_sols";

/** One item checked during an inventory. */
export type InventoryItem = {
  id: string;
  /** "Réfrigérateur double porte" */
  element: string;
  /** "Cuisine" */
  room: string;
  kind: ItemKind;
  condition: ItemCondition;
  /** Value of the item, or the repair cost when damaged, FCFA; null when not filled in. */
  cost: number | null;
  /** Number of photos taken. */
  photos: number;
};

/** An inventory ("état des lieux") of a property at move-in or move-out. */
export type Inventory = {
  id: string;
  /** "INV-2026-0031" */
  reference: string;
  type: InventoryType;
  /** ISO "YYYY-MM-DD". */
  date: string;
  /** "Appartement A4 · Résidence Les Palmiers" */
  property: string;
  tenant: string;
  /** Agency staff member who carried it out. */
  manager: string;
  items: InventoryItem[];
};

/** A table row: an item together with the inventory it belongs to. */
export type InventoryLine = InventoryItem & { inventory: Omit<Inventory, "items"> };
