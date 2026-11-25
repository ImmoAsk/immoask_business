import type { IconName } from "@/components/ui/icon";
import type { VersementMethod, VersementType } from "../types";

// Shared class names: ImmoAsk blue throughout.

export const versementsPanel =
  "rounded-3xl border border-zinc-100 bg-white shadow-[0_1px_3px_rgba(16,24,40,0.05)] dark:border-white/10 dark:bg-zinc-950";

export const versementsControl =
  "h-12 rounded-2xl border border-zinc-200 bg-white text-sm text-zinc-700 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-white/20";

export const fieldLabel = "text-[11px] font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400";

export const typeStyles: Record<VersementType, { badge: string; bar: string }> = {
  loyer: { badge: "bg-brand-600 text-white dark:bg-brand-500", bar: "bg-brand-700 dark:bg-brand-300" },
  caution: { badge: "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100", bar: "bg-brand-500 dark:bg-brand-500" },
  service: {
    badge: "bg-white text-brand-800 ring-1 ring-inset ring-brand-200 dark:bg-zinc-950 dark:text-brand-100 dark:ring-brand-700",
    bar: "bg-brand-300 dark:bg-brand-700",
  },
};

export const methodIcons: Record<VersementMethod, IconName> = { virement: "bank", mobile_money: "smartphone" };

/** Attachment tiles: documents darker, pictures lighter. */
export const fileTiles: Record<string, string> = {
  PDF: "from-brand-600 to-brand-900",
  JPG: "from-brand-300 to-brand-600",
  PNG: "from-brand-300 to-brand-600",
};
