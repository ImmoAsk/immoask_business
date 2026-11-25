import { daysBetween } from "@/lib/utils/dates";
import type { VersementMethod, VersementType } from "../types";

export const TYPE_LABELS: Record<VersementType, string> = { loyer: "Loyer", caution: "Caution", service: "Service" };

/** Plural, for tabs and the "Par type de dépôt" card. */
export const TYPE_PLURALS: Record<VersementType, string> = { loyer: "Loyers", caution: "Cautions", service: "Services" };

export const METHOD_LABELS: Record<VersementMethod, string> = { virement: "Virement", mobile_money: "Mobile Money" };

export const VERSEMENT_TYPES: VersementType[] = ["loyer", "caution", "service"];

/** Days since the deposit. */
export function ageDays(date: string, asOf: string) {
  return Math.max(0, daysBetween(date, asOf));
}

/** "Aujourd'hui", "Hier", "Il y a 5 jours" */
export function agoLabel(date: string, asOf: string) {
  const days = ageDays(date, asOf);
  return days === 0 ? "Aujourd'hui" : days === 1 ? "Hier" : `Il y a ${days} jours`;
}

/** "PDF", "JPG" */
export function fileExtension(name: string) {
  return (name.split(".").pop() ?? "").toUpperCase();
}

/** 188416 → "184 Ko" */
export function fileSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} Ko` : `${(bytes / 1024 / 1024).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} Mo`;
}
