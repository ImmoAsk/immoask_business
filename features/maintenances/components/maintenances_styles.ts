import type { IconName } from "@/components/ui/icon";
import type { MaintenanceCategory, MaintenanceStatus } from "../types";

// Shared class names: ImmoAsk blue throughout; orange only for requests waiting too long.

export const maintenancesPanel =
  "rounded-3xl border border-zinc-100 bg-white shadow-[0_1px_3px_rgba(16,24,40,0.05)] dark:border-white/10 dark:bg-zinc-950";

export const maintenancesControl =
  "h-12 rounded-2xl border border-zinc-200 bg-white text-sm text-zinc-700 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-white/20";

export const fieldLabel = "text-[11px] font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400";

/** Each category is told apart by its icon; every tile wears the same blue. */
export const categoryIcons: Record<MaintenanceCategory, IconName> = {
  plomberie: "droplet",
  electricite: "bolt",
  climatisation: "snowflake",
  serrurerie: "lock",
  peinture: "paintRoller",
  toiture: "home",
};

export const maintenanceStatuses: Record<MaintenanceStatus, { label: string; step: string; badge: string; dot: string; action: string }> = {
  nouvelle: {
    label: "Nouvelle",
    step: "Nouvelle",
    badge: "bg-white text-brand-700 ring-1 ring-inset ring-brand-200 dark:bg-transparent dark:text-brand-100 dark:ring-brand-700",
    dot: "bg-brand-400",
    action: "Démarrer le traitement",
  },
  en_traitement: {
    label: "En traitement",
    step: "En traitement",
    badge: "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100",
    dot: "bg-brand-600 dark:bg-brand-300",
    action: "Marquer comme résolue",
  },
  resolue: {
    label: "Résolue",
    step: "Résolue",
    badge: "bg-zinc-100 text-zinc-600 dark:bg-white/10 dark:text-zinc-300",
    dot: "bg-zinc-400",
    action: "Maintenance résolue",
  },
};
