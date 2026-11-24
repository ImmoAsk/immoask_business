import type { RentAgreementStatus, RentAgreementType, RentTerminationReason } from "../types";

// Shared class names: ImmoAsk blue throughout; orange only for deposits waiting to be returned.

export const rentPanel =
  "rounded-3xl border border-zinc-100 bg-white shadow-[0_1px_3px_rgba(16,24,40,0.05)] dark:border-white/10 dark:bg-zinc-950";

export const rentControl =
  "h-12 rounded-2xl border border-zinc-200 bg-white text-sm text-zinc-700 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-white/20";

export const fieldLabel = "text-[11px] font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400";

export const agreementStatuses: Record<RentAgreementStatus, { label: string; badge: string; dot: string }> = {
  actif: {
    label: "Actif",
    badge: "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100",
    dot: "bg-brand-600 dark:bg-brand-300",
  },
  a_venir: {
    label: "À venir",
    badge: "bg-white text-brand-700 ring-1 ring-inset ring-brand-200 dark:bg-transparent dark:text-brand-100 dark:ring-brand-700",
    dot: "bg-brand-400",
  },
  termine: {
    label: "Terminé",
    badge: "bg-zinc-100 text-zinc-600 dark:bg-white/10 dark:text-zinc-300",
    dot: "bg-zinc-400",
  },
  resilie: {
    label: "Résilié",
    badge: "bg-white text-zinc-600 ring-1 ring-inset ring-zinc-300 dark:bg-transparent dark:text-zinc-300 dark:ring-white/20",
    dot: "bg-zinc-500",
  },
};

export const agreementTypes: Record<RentAgreementType, { label: string; badge: string }> = {
  habitation: { label: "Habitation", badge: "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100" },
  commercial: { label: "Commercial", badge: "bg-brand-100 text-brand-900 dark:bg-brand-800/60 dark:text-brand-100" },
  sejour: { label: "Séjour", badge: "bg-brand-900 text-white dark:bg-brand-300 dark:text-brand-950" },
};

export const terminationReasons: Record<RentTerminationReason, string> = {
  depart_locataire: "Départ du locataire",
  impayes: "Impayés de loyer",
  accord_amiable: "Accord amiable",
};
