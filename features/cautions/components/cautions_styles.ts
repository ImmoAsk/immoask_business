import type { CautionMode, CautionStatus } from "../types";

// Shared class names: ImmoAsk blue throughout; orange only for deposits the tenant must refill.

export const cautionsPanel =
  "rounded-3xl border border-zinc-100 bg-white shadow-[0_1px_3px_rgba(16,24,40,0.05)] dark:border-white/10 dark:bg-zinc-950";

export const cautionsControl =
  "h-12 rounded-2xl border border-zinc-200 bg-white text-sm text-zinc-700 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-white/20";

export const fieldLabel = "text-[11px] font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400";

export const cautionStatuses: Record<CautionStatus, { label: string; badge: string; dot: string; fill: string; ring: string }> = {
  intacte: {
    label: "Intacte",
    badge: "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100",
    dot: "bg-brand-500 dark:bg-brand-300",
    fill: "bg-brand-600 dark:bg-brand-400",
    ring: "text-brand-300",
  },
  modifiee: {
    label: "Modifiée",
    badge: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
    dot: "bg-orange-500",
    fill: "bg-orange-500 dark:bg-orange-400",
    ring: "text-orange-300",
  },
};

export const modeStyles: Record<CautionMode, string> = {
  mois: "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100",
  montant: "bg-white text-brand-800 ring-1 ring-inset ring-brand-200 dark:bg-zinc-950 dark:text-brand-100 dark:ring-brand-700",
};
