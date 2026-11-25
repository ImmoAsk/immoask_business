import { daysBetween } from "@/lib/utils/dates";
import type { Maintenance, MaintenanceCategory, MaintenanceStatus } from "../types";

/** A request left unresolved this many days needs attention. */
export const STALE_DAYS = 7;

/** Days since the request was created. */
export function ageDays(maintenance: Maintenance, asOf: string) {
  return Math.max(0, daysBetween(maintenance.createdAt, asOf));
}

export function isStale(maintenance: Maintenance, asOf: string) {
  return maintenance.status !== "resolue" && ageDays(maintenance, asOf) >= STALE_DAYS;
}

/** "Aujourd'hui", "Hier", "Il y a 3 jours" */
export function agoLabel(maintenance: Maintenance, asOf: string) {
  const days = ageDays(maintenance, asOf);
  return days === 0 ? "Aujourd'hui" : days === 1 ? "Hier" : `Il y a ${days} jours`;
}

/** The step the main action moves a request to; null once resolved. */
export function nextStatus(status: MaintenanceStatus): MaintenanceStatus | null {
  return status === "nouvelle" ? "en_traitement" : status === "en_traitement" ? "resolue" : null;
}

export const MAINTENANCE_STEPS: MaintenanceStatus[] = ["nouvelle", "en_traitement", "resolue"];

export const CATEGORY_LABELS: Record<MaintenanceCategory, string> = {
  plomberie: "Plomberie",
  electricite: "Électricité",
  climatisation: "Climatisation",
  serrurerie: "Serrurerie",
  peinture: "Peinture",
  toiture: "Toiture",
};
