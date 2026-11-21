import type { IconName } from "@/components/ui/icon";
import { propertyKinds } from "@/components/ui/property_thumbnail";
import type { PortofolioBienStatus, PortofolioPaymentState } from "../types";

// Shared class names and labels for the portfolio components.

export const portofolioPanel =
  "rounded-3xl border border-zinc-100 bg-white shadow-[0_1px_3px_rgba(16,24,40,0.05)] dark:border-white/10 dark:bg-zinc-950";

/** Outlined control in the toolbar (search, filters, sort). */
export const portofolioControl =
  "h-12 rounded-2xl border border-zinc-200 bg-white text-sm text-zinc-700 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-white/20";

/** Labels and icons per kind (shared with the other features). */
export const portofolioTypes = propertyKinds;

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
