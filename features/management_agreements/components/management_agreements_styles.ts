import type { ManagementAgreementStatus, ManagementTerminationReason } from "../types";

// Shared class names: ImmoAsk blue throughout; orange only for contracts waiting for action.

export const managementPanel =
  "rounded-3xl border border-zinc-100 bg-white shadow-[0_1px_3px_rgba(16,24,40,0.05)] dark:border-white/10 dark:bg-zinc-950";

/** Outlined control in the toolbar (search, dropdowns). */
export const managementControl =
  "h-12 rounded-2xl border border-zinc-200 bg-white text-sm text-zinc-700 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-white/20";

/** Small uppercase field label. */
export const fieldLabel = "text-[11px] font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400";

export const agreementStatuses: Record<ManagementAgreementStatus, { label: string; badge: string; dot: string }> = {
  actif: {
    label: "Actif",
    badge: "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100",
    dot: "bg-brand-600 dark:bg-brand-300",
  },
  en_attente: {
    label: "En attente",
    badge: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
    dot: "bg-orange-500",
  },
  resilie: {
    label: "Résilié",
    badge: "bg-zinc-100 text-zinc-600 dark:bg-white/10 dark:text-zinc-300",
    dot: "bg-zinc-400",
  },
};

export const terminationReasons: Record<ManagementTerminationReason, string> = {
  fin_mandat: "Fin de mandat",
  manquement_gestionnaire: "Manquement du gestionnaire",
  accord_amiable: "Accord amiable",
};
