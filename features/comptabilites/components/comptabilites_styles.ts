import type { IconName } from "@/components/ui/icon";
import type { ComptabiliteCategory, ComptabiliteFlow, ComptabiliteStatus } from "../types";

// Shared class names: ImmoAsk blue throughout. Chart series use the validated chart-* tokens
// (app/globals.css); orange/red only for income not received and for worsening figures.

export const comptabilitesPanel =
  "rounded-3xl border border-zinc-100 bg-white shadow-[0_1px_3px_rgba(16,24,40,0.05)] dark:border-white/10 dark:bg-zinc-950";

/** Outlined control in the toolbar (search, dropdowns). */
export const comptabilitesControl =
  "h-12 rounded-2xl border border-zinc-200 bg-white text-sm text-zinc-700 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-white/20";

/** Series colours: background (bars, swatches) and text (sparklines use currentColor). */
export const flowColors: Record<ComptabiliteFlow, { bg: string; text: string; label: string }> = {
  recette: { bg: "bg-chart-income", text: "text-chart-income", label: "Recettes" },
  depense: { bg: "bg-chart-expense", text: "text-chart-expense", label: "Dépenses" },
};

export const categoryIcons: Record<ComptabiliteCategory, IconName> = {
  loyer: "home",
  caution: "shield",
  charges_locatives: "receipt",
  entretien: "wrench",
  charges_communes: "file",
  autre: "wallet",
};

export const flowTiles: Record<ComptabiliteFlow, string> = {
  recette: "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100",
  depense: "bg-brand-100 text-brand-900 dark:bg-brand-800/60 dark:text-brand-100",
};

export function statusStyle(status: ComptabiliteStatus, flow: ComptabiliteFlow) {
  switch (status) {
    case "regle":
      return {
        label: flow === "recette" ? "Reçu" : "Payée",
        icon: "checkCircle" as IconName,
        badge: "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100",
      };
    case "en_cours":
      return {
        label: "En cours",
        icon: "clock" as IconName,
        badge: "bg-white text-brand-700 ring-1 ring-inset ring-brand-200 dark:bg-transparent dark:text-brand-100 dark:ring-brand-700",
      };
    case "en_attente":
      return {
        label: "En attente",
        icon: "hourglass" as IconName,
        badge: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
      };
  }
}
