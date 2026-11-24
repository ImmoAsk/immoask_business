import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/utils/dates";
import type { ExportTable } from "@/lib/utils/export";
import { formatAmount } from "@/lib/utils/format";
import { formatPhone } from "@/lib/utils/phone";
import { commissionPercent, stayNights } from "../hooks/reservations_stay";
import type { Reservation } from "../types";
import { reservationStatuses } from "./reservations_styles";

// Small building blocks shared by the table, the mobile cards, the detail panel and the export.

/** First and last name initials ("Fatou Ndiaye" → "FN"). */
export function tenantInitials(name: string) {
  const words = name.split(/\s+/).filter((word) => /^\p{Lu}/u.test(word));
  const picked = words.length > 1 ? [words[0], words.at(-1)!] : words;
  return picked.map((word) => word[0]).join("");
}

/** "2026-12-12" → "12 déc." */
export const shortDay = (iso: string) => formatShortDate(iso).replace(/ \d{4}$/, "");

export const nightsLabel = (reservation: Reservation) => {
  const nights = stayNights(reservation);
  return `${nights} nuit${nights > 1 ? "s" : ""}`;
};

/** "8 %" or "8,4 %" */
export const percentText = (reservation: Reservation) =>
  `${commissionPercent(reservation).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %`;

export const fcfa = (value: number) => `${formatAmount(value)} FCFA`;

export function TenantAvatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-full bg-linear-to-br from-brand-50 to-brand-100 text-[11px] font-bold text-brand-700 dark:from-brand-900 dark:to-brand-800 dark:text-brand-100",
        className,
      )}
    >
      {tenantInitials(name)}
    </span>
  );
}

export function StatusBadge({ reservation, className }: { reservation: Reservation; className?: string }) {
  const status = reservationStatuses[reservation.status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap", status.badge, className)}>
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", status.dot)} />
      {status.label}
    </span>
  );
}

/** Rows for the CSV / PDF export. */
export function reservationsExportTable(reservations: Reservation[]): ExportTable {
  return {
    title: "Réservations ImmoAsk",
    header: [
      "N° réservation",
      "Propriété",
      "Locataire",
      "Téléphone",
      "Arrivée",
      "Départ",
      "Nuits",
      "Lieu de prise",
      "Propriétaire",
      "Gestionnaire",
      "Montant total (FCFA)",
      "Commission (FCFA)",
      "Commission (%)",
      "Statut",
    ],
    rows: reservations.map((reservation) => [
      reservation.reference,
      reservation.property,
      reservation.tenant.name,
      formatPhone(reservation.tenant.phone),
      formatShortDate(reservation.arrival),
      formatShortDate(reservation.departure),
      stayNights(reservation),
      reservation.pickup,
      reservation.owner,
      reservation.manager,
      reservation.amount,
      reservation.commission,
      Math.round(commissionPercent(reservation) * 10) / 10,
      reservationStatuses[reservation.status].label,
    ]),
  };
}
