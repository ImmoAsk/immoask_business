import type { VersementCurrency, VersementType } from "./versement";

/** Figures for the four cards. */
export type VersementKpis = {
  total: { count: number; thisMonth: number; /** ISO "YYYY-MM". */ month: string; history: number[] };
  /** FCFA total, plus what was paid in other currencies (never converted). */
  amounts: { fcfa: number; others: { currency: Exclude<VersementCurrency, "FCFA">; amount: number }[] };
  transfers: { count: number; mobileMoney: number; percent: number };
  byType: { type: VersementType; count: number; percent: number }[];
};
