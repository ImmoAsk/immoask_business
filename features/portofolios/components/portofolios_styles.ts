import type { IconName } from "@/components/ui/icon";
import type { PortofolioBienStatus, PortofolioBienType, PortofolioPaymentState } from "../types";

// Shared class names and labels for the portfolio components.

export const portofolioPanel =
  "rounded-3xl border border-zinc-100 bg-white shadow-[0_1px_3px_rgba(16,24,40,0.05)] dark:border-white/10 dark:bg-zinc-950";

/** Outlined control in the toolbar (search, filters, sort). */
export const portofolioControl =
  "h-12 rounded-2xl border border-zinc-200 bg-white text-sm text-zinc-700 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-white/20";

export const portofolioTypes: Record<PortofolioBienType, { label: string; icon: IconName; tile: string }> = {
  villa: {
    label: "Villa",
    icon: "home",
    tile: "from-sky-100 to-brand-100 text-brand-700 dark:from-brand-900 dark:to-sky-950 dark:text-brand-100",
  },
  appartement: {
    label: "Appartement",
    icon: "building",
    tile: "from-indigo-50 to-indigo-100 text-indigo-600 dark:from-indigo-950 dark:to-zinc-900 dark:text-indigo-300",
  },
  studio: {
    label: "Studio",
    icon: "sofa",
    tile: "from-violet-50 to-violet-100 text-violet-600 dark:from-violet-950 dark:to-zinc-900 dark:text-violet-300",
  },
  terrain: {
    label: "Terrain",
    icon: "trees",
    tile: "from-lime-50 to-emerald-100 text-emerald-700 dark:from-emerald-950 dark:to-zinc-900 dark:text-emerald-300",
  },
  immeuble: {
    label: "Immeuble",
    icon: "building",
    tile: "from-slate-100 to-slate-200 text-slate-600 dark:from-slate-800 dark:to-zinc-900 dark:text-slate-300",
  },
  boutique: {
    label: "Boutique",
    icon: "store",
    tile: "from-amber-50 to-orange-100 text-orange-600 dark:from-amber-950 dark:to-zinc-900 dark:text-amber-300",
  },
};

export const portofolioStatuses: Record<PortofolioBienStatus, { label: string; badge: string; dot: string }> = {
  loue: {
    label: "Loué",
    badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  vacant: {
    label: "Vacant",
    badge: "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100",
    dot: "bg-brand-500",
  },
  en_travaux: {
    label: "En travaux",
    badge: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
    dot: "bg-orange-500",
  },
};

export const portofolioPayments: Record<PortofolioPaymentState, { label: string; icon: IconName; className: string }> = {
  a_jour: {
    label: "À jour",
    icon: "checkCircle",
    className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  virement_recu: {
    label: "Virement reçu",
    icon: "checkCircle",
    className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  en_retard: {
    label: "En retard",
    icon: "clock",
    className: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
};
