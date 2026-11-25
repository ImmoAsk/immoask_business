import { daysBetween } from "@/lib/utils/dates";
import type { Inventory, InventoryLine, InventoryType, ItemCondition, ItemKind } from "../types";

export const TYPE_LABELS: Record<InventoryType, string> = { entree: "Entrée", sortie: "Sortie" };

export const CONDITION_LABELS: Record<ItemCondition, string> = {
  excellent: "Excellent",
  bon: "Bon",
  moyen: "Moyen",
  endommage: "Endommagé",
};

export const KIND_LABELS: Record<ItemKind, string> = {
  mobilier: "Mobilier",
  electromenager: "Électroménager",
  climatisation: "Climatisation",
  literie: "Literie",
  menuiserie: "Menuiserie",
  murs_sols: "Murs et sols",
};

/** Higher is better; used to compare move-in and move-out. */
const CONDITION_RANK: Record<ItemCondition, number> = { excellent: 3, bon: 2, moyen: 1, endommage: 0 };

/** Every item of every inventory, most recent inventory first. */
export function inventoryLines(inventories: Inventory[]): InventoryLine[] {
  return inventories
    .flatMap(({ items, ...inventory }) => items.map((item) => ({ ...item, inventory })))
    .sort((a, b) => b.inventory.date.localeCompare(a.inventory.date));
}

/** "Aujourd'hui", "Hier", "Il y a 5 jours", "Il y a 7 mois" */
export function agoLabel(date: string, asOf: string) {
  const days = Math.max(0, daysBetween(date, asOf));
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  return days < 60 ? `Il y a ${days} jours` : `Il y a ${Math.round(days / 30)} mois`;
}

/** The same item in the same property, from the other inventory type. */
export function counterpart(line: InventoryLine, lines: InventoryLine[]) {
  return (
    lines.find(
      (other) => other.inventory.property === line.inventory.property && other.element === line.element && other.inventory.type !== line.inventory.type,
    ) ?? null
  );
}

/** Move-in and move-out of one item, and how its condition changed. */
export function compareLines(line: InventoryLine, other: InventoryLine) {
  const entry = line.inventory.type === "entree" ? line : other;
  const exit = line.inventory.type === "sortie" ? line : other;
  const delta = CONDITION_RANK[exit.condition] - CONDITION_RANK[entry.condition];
  return { entry, exit, trend: delta < 0 ? ("worse" as const) : delta === 0 ? ("same" as const) : ("better" as const) };
}
