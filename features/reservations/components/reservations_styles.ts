import type { ReservationStatus } from "../types";

// Shared class names: ImmoAsk blue throughout; orange only for departures that need attention.

export const reservationsPanel =
  "rounded-3xl border border-zinc-100 bg-white shadow-[0_1px_3px_rgba(16,24,40,0.05)] dark:border-white/10 dark:bg-zinc-950";

export const reservationsControl =
  "h-12 rounded-2xl border border-zinc-200 bg-white text-sm text-zinc-700 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-white/20";

export const fieldLabel = "text-[11px] font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400";

export const reservationStatuses: Record<ReservationStatus, { label: string; badge: string; dot: string; action: string }> = {
  nouvelle: {
    label: "Nouvelle",
    badge: "bg-white text-brand-700 ring-1 ring-inset ring-brand-200 dark:bg-transparent dark:text-brand-100 dark:ring-brand-700",
    dot: "bg-brand-400",
    action: "Confirmer l'arrivée (check-in)",
  },
  en_cours: {
    label: "En cours",
    badge: "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100",
    dot: "bg-brand-600 dark:bg-brand-300",
    action: "Clôturer le séjour (check-out)",
  },
  effectuee: {
    label: "Effectuée",
    badge: "bg-zinc-100 text-zinc-600 dark:bg-white/10 dark:text-zinc-300",
    dot: "bg-zinc-400",
    action: "Séjour effectué",
  },
};
