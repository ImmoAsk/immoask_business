import type { IconName } from "@/components/ui/icon";
import type { RentPaymentMethod, RentPaymentStatus } from "../types";

// Shared class names and labels: ImmoAsk blue throughout; orange and red only for rent still owed.

export const rentPaymentsPanel =
  "rounded-3xl border border-zinc-100 bg-white shadow-[0_1px_3px_rgba(16,24,40,0.05)] dark:border-white/10 dark:bg-zinc-950";

/** Outlined control in the toolbar (search, dropdowns). */
export const rentPaymentsControl =
  "h-12 rounded-2xl border border-zinc-200 bg-white text-sm text-zinc-700 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-white/20";

export const paymentStatuses: Record<
  RentPaymentStatus,
  { label: string; badge: string; dot: string; bar: string; amount: string }
> = {
  paye: {
    label: "Complètement payé",
    badge: "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100",
    dot: "bg-brand-600",
    bar: "bg-brand-600",
    amount: "text-brand-700 dark:text-brand-100",
  },
  partiel: {
    label: "Partiellement payé",
    badge: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
    dot: "bg-orange-500",
    bar: "bg-orange-500",
    amount: "text-orange-600 dark:text-orange-400",
  },
  a_payer: {
    label: "À payer",
    badge: "bg-white text-brand-700 ring-1 ring-inset ring-brand-200 dark:bg-transparent dark:text-brand-100 dark:ring-brand-700",
    dot: "bg-brand-300",
    bar: "bg-brand-300",
    amount: "text-zinc-950 dark:text-zinc-50",
  },
  en_retard: {
    label: "En retard",
    badge: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
    dot: "bg-red-500",
    bar: "bg-red-500",
    amount: "text-red-600 dark:text-red-400",
  },
};

export const paymentMethods: Record<RentPaymentMethod | "attente", { label: string; icon: IconName; chip: string }> = {
  mobile_money: {
    label: "Mobile Money",
    icon: "phone",
    chip: "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100",
  },
  virement: {
    label: "Virement",
    icon: "bank",
    chip: "bg-brand-100 text-brand-800 dark:bg-brand-800/60 dark:text-brand-100",
  },
  especes: {
    label: "Espèces",
    icon: "cash",
    chip: "bg-brand-600 text-white dark:bg-brand-500",
  },
  cheque: {
    label: "Chèque",
    icon: "receipt",
    chip: "bg-brand-900 text-white dark:bg-brand-300 dark:text-brand-950",
  },
  attente: {
    label: "En attente",
    icon: "clock",
    chip: "bg-zinc-100 text-zinc-600 dark:bg-white/10 dark:text-zinc-300",
  },
};

// Avatar shades follow the tenant (stable across filters and pages), not the row position.
export const avatarTones = [
  "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100",
  "bg-brand-100 text-brand-800 dark:bg-brand-800/60 dark:text-brand-100",
  "bg-brand-200 text-brand-900 dark:bg-brand-700/60 dark:text-brand-50",
  "bg-brand-600 text-white dark:bg-brand-500",
  "bg-brand-900 text-white dark:bg-brand-300 dark:text-brand-950",
];
