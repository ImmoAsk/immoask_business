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
    badge: "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100",
    dot: "bg-brand-500",
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
    badge: "bg-brand-800 text-white dark:bg-brand-300 dark:text-brand-950",
  },
};

// Avatar colors follow the tenant (stable across filters and pages), not the row position.
export const avatarTones = [
  "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100",
  "bg-brand-100 text-brand-800 dark:bg-brand-800/60 dark:text-brand-100",
  "bg-brand-200 text-brand-900 dark:bg-brand-700/60 dark:text-brand-50",
  "bg-brand-600 text-white dark:bg-brand-500",
  "bg-brand-900 text-white dark:bg-brand-300 dark:text-brand-950",
];
