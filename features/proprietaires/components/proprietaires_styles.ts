import type {
  ProprietaireMandateType,
  ProprietaireProfile,
  ProprietaireReversementStatus,
} from "../types";

// Shared class names and labels for the owner components.

export const proprietairesPanel =
  "rounded-3xl border border-zinc-100 bg-white shadow-[0_1px_3px_rgba(16,24,40,0.05)] dark:border-white/10 dark:bg-zinc-950";

/** Outlined control in the toolbar (search, dropdowns). */
export const proprietairesControl =
  "h-12 rounded-2xl border border-zinc-200 bg-white text-sm text-zinc-700 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-white/20";

export const reversementStatuses: Record<ProprietaireReversementStatus, { label: string; badge: string; dot: string }> = {
  a_jour: {
    label: "À jour",
    badge: "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100",
    dot: "bg-brand-500",
  },
  en_attente: {
    label: "En attente",
    badge: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
    dot: "bg-orange-500",
  },
  planifie: {
    label: "Planifié",
    badge: "bg-white text-brand-700 ring-1 ring-inset ring-brand-200 dark:bg-transparent dark:text-brand-100 dark:ring-brand-700",
    dot: "bg-brand-300",
  },
};

export const mandateTypes: Record<ProprietaireMandateType, { label: string; badge: string }> = {
  exclusif: {
    label: "Exclusif",
    badge: "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100",
  },
  simple: {
    label: "Simple",
    badge: "bg-zinc-100 text-zinc-700 dark:bg-white/10 dark:text-zinc-300",
  },
};

export const profileLabels: Record<ProprietaireProfile, string> = {
  resident: "Résident",
  diaspora: "Diaspora",
  entreprise: "Entreprise",
};

// Avatar shades follow the profile: residents light blue, diaspora mid blue, companies deep blue.
export const avatarTones: Record<ProprietaireProfile, string> = {
  resident: "bg-brand-50 text-brand-700 ring-brand-100 dark:bg-brand-900/60 dark:text-brand-100 dark:ring-brand-700/50",
  diaspora: "bg-brand-100 text-brand-800 ring-brand-200/70 dark:bg-brand-800/60 dark:text-brand-100 dark:ring-brand-700/50",
  entreprise: "bg-brand-900 text-white ring-brand-200 dark:bg-brand-300 dark:text-brand-950 dark:ring-brand-700/50",
};
