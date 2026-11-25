import type { IconName } from "@/components/ui/icon";
import type { InventoryType, ItemCondition, ItemKind } from "../types";

// Shared class names: ImmoAsk blue throughout; orange and red only for worn and damaged items.

export const etatLieuxPanel =
  "rounded-3xl border border-zinc-100 bg-white shadow-[0_1px_3px_rgba(16,24,40,0.05)] dark:border-white/10 dark:bg-zinc-950";

export const etatLieuxControl =
  "h-12 rounded-2xl border border-zinc-200 bg-white text-sm text-zinc-700 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-white/20";

export const fieldLabel = "text-[11px] font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400";

/** Each kind is told apart by its icon; every tile wears the same blue. */
export const kindIcons: Record<ItemKind, IconName> = {
  mobilier: "sofa",
  electromenager: "fridge",
  climatisation: "snowflake",
  literie: "bed",
  menuiserie: "door",
  murs_sols: "paintRoller",
};

export const conditionStyles: Record<ItemCondition, { badge: string; dot: string }> = {
  excellent: { badge: "bg-brand-600 text-white dark:bg-brand-500", dot: "bg-white" },
  bon: { badge: "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100", dot: "bg-brand-500 dark:bg-brand-300" },
  moyen: { badge: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300", dot: "bg-orange-500" },
  endommage: { badge: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300", dot: "bg-red-500" },
};

export const typeStyles: Record<InventoryType, string> = {
  entree: "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100",
  sortie: "bg-white text-brand-800 ring-1 ring-inset ring-brand-200 dark:bg-zinc-950 dark:text-brand-100 dark:ring-brand-700",
};

/** Placeholder "photos": the same blue tile, lit and framed differently. */
export const photoVariants = [
  { tile: "from-brand-400 to-brand-700", one: "-top-16 -right-12", two: "-bottom-16 -left-10" },
  { tile: "from-brand-300 to-brand-600", one: "-top-16 -left-10", two: "-right-14 -bottom-14" },
  { tile: "from-brand-500 to-brand-800", one: "-right-8 -bottom-20", two: "-top-8 -left-12" },
  { tile: "from-brand-400 to-brand-900", one: "-top-24 left-8", two: "-right-5 -bottom-24" },
];
