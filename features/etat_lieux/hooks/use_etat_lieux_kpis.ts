import type { Inventory, InventoryKpis, InventoryLine } from "../types";

/** Derives the four cards from the inventories, so they always match the table. */
export function computeEtatLieuxKpis(inventories: Inventory[], lines: InventoryLine[], history: number[]): InventoryKpis {
  const damaged = lines.filter((line) => line.condition === "endommage");
  const costed = damaged.filter((line) => line.cost !== null);
  const good = lines.filter((line) => line.condition === "bon" || line.condition === "excellent").length;

  return {
    inventories: {
      count: inventories.length,
      entries: inventories.filter((inventory) => inventory.type === "entree").length,
      exits: inventories.filter((inventory) => inventory.type === "sortie").length,
      history: [...history, inventories.length],
    },
    damaged: { count: damaged.length },
    damageCost: {
      amount: costed.reduce((sum, line) => sum + (line.cost ?? 0), 0),
      costed: costed.length,
      damaged: damaged.length,
      percent: damaged.length === 0 ? 0 : (costed.length / damaged.length) * 100,
    },
    good: { count: good, total: lines.length, percent: lines.length === 0 ? 0 : (good / lines.length) * 100 },
  };
}

export function useEtatLieuxKpis(inventories: Inventory[], lines: InventoryLine[], history: number[]) {
  return computeEtatLieuxKpis(inventories, lines, history);
}
