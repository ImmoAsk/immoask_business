import type { LocataireLeaseType, LocatairePaymentStatus } from "../types";

// Shared class names and labels for the tenant components.

export const locatairesPanel =
  "rounded-3xl border border-zinc-100 bg-white shadow-[0_1px_3px_rgba(16,24,40,0.05)] dark:border-white/10 dark:bg-zinc-950";

/** Outlined control in the toolbar (search, dropdowns). */
export const locatairesControl =
  "h-12 rounded-2xl border border-zinc-200 bg-white text-sm text-zinc-700 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-white/20";

export const paymentStatuses: Record<LocatairePaymentStatus, { label: string; badge: string; dot: string }> = {
  a_jour: {
    label: "À jour",
    badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  en_retard: {
    label: "En retard",
    badge: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
    dot: "bg-red-500",
  },
};

export const leaseTypes: Record<LocataireLeaseType, { label: string; badge: string }> = {
  residentiel: {
    label: "Résidentiel",
    badge: "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100",
  },
  commercial: {
    label: "Commercial",
    badge: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
};

// Avatar colors follow the tenant (stable across filters and pages), not the row position.
export const avatarTones = [
  "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100",
  "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
  "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
];
