/** Figures for the four cards. */
export type InventoryKpis = {
  inventories: { count: number; entries: number; exits: number; history: number[] };
  damaged: { count: number };
  /** Cost of the damaged items that have one. */
  damageCost: { amount: number; costed: number; damaged: number; percent: number };
  /** Items in "bon" or "excellent" condition. */
  good: { count: number; total: number; percent: number };
};
