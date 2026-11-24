"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/utils/dates";
import { nextStatus, stayNights } from "../hooks/reservations_stay";
import type { Reservation } from "../types";
import { fcfa, percentText, StatusBadge, tenantInitials } from "./reservations_parts";
import { fieldLabel, reservationStatuses, reservationsPanel } from "./reservations_styles";

const outline = cn(
  "inline-flex h-11 cursor-pointer items-center justify-center rounded-xl border border-zinc-300 bg-white px-3 text-center text-sm font-semibold text-zinc-900 hover:border-brand-400 dark:border-white/15 dark:bg-transparent dark:text-zinc-100",
  focusRing,
);

export type ReservationsDetailProps = {
  reservation: Reservation | null;
  /** Check-in or check-out. */
  onAdvance: () => void;
  className?: string;
};

/** The selected stay: dates, parties, amounts, key pickup and the next step. */
export function ReservationsDetail({ reservation, onAdvance, className }: ReservationsDetailProps) {
  if (!reservation) {
    return (
      <aside className={cn(reservationsPanel, "p-6 text-center text-sm text-zinc-500 dark:text-zinc-400", className)}>
        Sélectionnez une réservation pour voir son détail.
      </aside>
    );
  }

  const nights = stayNights(reservation);
  const done = nextStatus(reservation.status) === null;
  const facts: [string, string][] = [
    ["Propriété", reservation.property],
    ["Locataire", reservation.tenant.name],
    ["Propriétaire", reservation.owner],
    ["Gestionnaire", reservation.manager],
  ];

  return (
    <aside aria-labelledby="reservations-detail-title" className={cn(reservationsPanel, "overflow-hidden", className)}>
      <header className="flex flex-col gap-3 bg-linear-to-br from-brand-950 via-brand-900 to-brand-700 px-6 pt-5 pb-5 text-white">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-bold tracking-[0.12em] text-brand-200">RÉSERVATION</span>
          <StatusBadge reservation={reservation} className="ring-1 ring-white/20" />
        </div>
        <div className="flex items-center gap-3.5">
          <span
            aria-hidden="true"
            className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-white/35 bg-linear-to-br from-brand-400 to-brand-600 text-[15px] font-bold"
          >
            {tenantInitials(reservation.tenant.name)}
          </span>
          <div className="min-w-0">
            <h2 id="reservations-detail-title" className="text-[22px] leading-tight font-bold tracking-tight tabular-nums">
              {reservation.reference}
            </h2>
            <p className="mt-0.5 truncate text-[13px] text-brand-100">{reservation.tenant.name}</p>
          </div>
        </div>
        <p className="text-[13px] leading-relaxed text-brand-100">{reservation.property}</p>
      </header>

      <div className="flex flex-col gap-5 p-6">
        <div className="flex items-stretch gap-2.5">
          <div className="flex-1 rounded-xl border border-brand-100 bg-brand-50/70 px-3.5 py-3 dark:border-brand-800/60 dark:bg-brand-900/30">
            <p className={cn(fieldLabel, "text-brand-800 dark:text-brand-100")}>Arrivée</p>
            <p className="mt-1 text-[15px] font-bold text-brand-800 tabular-nums dark:text-brand-100">{formatShortDate(reservation.arrival)}</p>
          </div>
          <div className="flex shrink-0 flex-col items-center justify-center gap-1 text-zinc-500 dark:text-zinc-400">
            <Icon name="arrowRight" className="size-5 text-brand-500" strokeWidth={2.2} />
            <span className="text-xs font-bold tabular-nums">
              {nights} nuit{nights > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-3 dark:border-white/10 dark:bg-white/5">
            <p className={fieldLabel}>Départ</p>
            <p className="mt-1 text-[15px] font-bold text-zinc-900 tabular-nums dark:text-zinc-100">{formatShortDate(reservation.departure)}</p>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
          {facts.map(([term, value]) => (
            <div key={term} className="min-w-0">
              <dt className={fieldLabel}>{term}</dt>
              <dd className="mt-1 text-sm leading-snug font-semibold text-zinc-900 dark:text-zinc-100">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-xl border border-brand-100 bg-brand-50/70 px-4 py-3 dark:border-brand-800/60 dark:bg-brand-900/30">
            <p className={cn(fieldLabel, "text-brand-800 dark:text-brand-100")}>Montant total</p>
            <p className="mt-1 text-lg font-bold text-brand-800 tabular-nums dark:text-brand-100">{fcfa(reservation.amount)}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              pour {nights} nuit{nights > 1 ? "s" : ""}
            </p>
          </div>
          <div className="rounded-xl border border-brand-200 bg-brand-100/60 px-4 py-3 dark:border-brand-700/60 dark:bg-brand-800/30">
            <p className={cn(fieldLabel, "text-brand-900 dark:text-brand-100")}>Commission</p>
            <p className="mt-1 text-lg font-bold text-brand-900 tabular-nums dark:text-brand-100">{fcfa(reservation.commission)}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{percentText(reservation)} du montant</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/60 dark:text-brand-100">
            <Icon name="mapPin" className="size-4.5" />
          </span>
          <div>
            <p className={fieldLabel}>Lieu de prise</p>
            <p className="mt-0.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{reservation.pickup}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onAdvance}
            disabled={done}
            className={cn(
              "inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-br from-brand-500 to-brand-700 text-sm font-bold text-white shadow-[0_8px_18px_-6px_rgba(10,116,174,0.6)] hover:from-brand-600 hover:to-brand-800 disabled:cursor-not-allowed disabled:opacity-45",
              focusRing,
            )}
          >
            <Icon name={done ? "checkCircle" : "calendarCheck"} className="size-4.5" strokeWidth={2.2} />
            {reservationStatuses[reservation.status].action}
          </button>
          <div className="grid grid-cols-2 gap-2.5">
            <a href={`tel:${reservation.tenant.phone}`} className={outline}>
              Contacter le locataire
            </a>
            <Link href="/app/portofolio" className={outline}>
              Voir la propriété
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
