import type { IconName } from "@/components/ui/icon";
import type { CalendrieAvailability, CalendrieReason } from "../types";

// Shared class names: ImmoAsk blue throughout; orange only for maintenance (works), as elsewhere.

export const calendriesPanel =
  "rounded-3xl border border-zinc-100 bg-white shadow-[0_1px_3px_rgba(16,24,40,0.05)] dark:border-white/10 dark:bg-zinc-950";

export const calendriesControl =
  "rounded-2xl border border-zinc-200 bg-white text-sm text-zinc-700 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-white/20";

export const reasons: Record<CalendrieReason, { label: string; icon: IconName; bar: string; badge: string; swatch: string }> = {
  reservation: {
    label: "Réservation",
    icon: "calendarCheck",
    bar: "bg-brand-600 text-white dark:bg-brand-500",
    badge: "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100",
    swatch: "bg-brand-600 dark:bg-brand-500",
  },
  sejour_proprietaire: {
    label: "Séjour propriétaire",
    icon: "home",
    bar: "bg-brand-900 text-white dark:bg-brand-300 dark:text-brand-950",
    badge: "bg-brand-100 text-brand-900 dark:bg-brand-800/60 dark:text-brand-100",
    swatch: "bg-brand-900 dark:bg-brand-300",
  },
  maintenance: {
    label: "Maintenance",
    icon: "wrench",
    bar: "bg-orange-500 text-white",
    badge: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
    swatch: "bg-orange-500",
  },
  autre: {
    label: "Autre",
    icon: "sparkles",
    bar: "bg-brand-300 text-brand-950",
    badge: "bg-white text-brand-700 ring-1 ring-inset ring-brand-200 dark:bg-transparent dark:text-brand-100 dark:ring-brand-700",
    swatch: "bg-brand-300",
  },
};

/** Free days, drawn as a quiet bar. */
export const freeBar =
  "bg-brand-50/80 text-brand-700 ring-1 ring-inset ring-brand-100 dark:bg-brand-900/25 dark:text-brand-100 dark:ring-brand-800/60";

export const availabilityStyles: Record<CalendrieAvailability, { label: string; badge: string; dot: string }> = {
  disponible: {
    label: "Disponible",
    badge: "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100",
    dot: "bg-brand-500",
  },
  indisponible: {
    label: "Indisponible",
    badge: "bg-brand-900 text-white dark:bg-brand-300 dark:text-brand-950",
    dot: "bg-white dark:bg-brand-950",
  },
};
