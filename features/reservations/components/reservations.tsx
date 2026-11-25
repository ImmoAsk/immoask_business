"use client";

import { WorkspaceScopeNotice } from "@/features/workspace/components";
import { useRef, useState } from "react";
import { nextStatus } from "../hooks/reservations_stay";
import { useReservationsData } from "../hooks/use_reservations_data";
import { useReservationsKpis } from "../hooks/use_reservations_kpis";
import { useReservationsList } from "../hooks/use_reservations_list";
import { useReservationsInScope } from "../hooks/use_reservations_scope";
import { useReservationsSelection } from "../hooks/use_reservations_selection";
import { useReservationsStore } from "../hooks/use_reservations_store";
import type { Reservation } from "../types";
import { ReservationsDetail } from "./reservations_detail";
import { ReservationsFilters } from "./reservations_filters";
import { ReservationsKpi } from "./reservations_kpi";
import { ReservationsTable } from "./reservations_table";

const DETAIL_ID = "reservation-detail";

/** "Réservations": stays in furnished properties, from booking to check-out. */
export function Reservations() {
  const { data } = useReservationsData();
  const store = useReservationsStore(data.reservations);
  const reservations = useReservationsInScope(store.reservations);
  const kpis = useReservationsKpis(reservations, data.asOf, data.newHistory);
  const list = useReservationsList(reservations);
  const selection = useReservationsSelection(list.results.map((reservation) => reservation.id));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const results = list.results;
  const selected = results.find((reservation) => reservation.id === selectedId) ?? results[0] ?? null;

  const flash = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3200);
  };

  const select = (reservation: Reservation) => {
    setSelectedId(reservation.id);
    // Below 1600px the panel sits under the table: bring it into view.
    if (!window.matchMedia("(min-width: 100rem)").matches) {
      document.getElementById(DETAIL_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">Réservations</h1>
        <p className="mt-1 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
          Séjours des biens immobiliers meublés : arrivées, départs, lieux de prise en charge et suivi de chaque locataire.
        </p>
        <WorkspaceScopeNotice className="mt-3" />
      </header>

      <ReservationsKpi kpis={kpis} onShowInProgress={() => list.setTab("en_cours")} onShowDone={() => list.setTab("effectuee")} />

      <ReservationsFilters list={list} open={filtersOpen} onToggle={() => setFiltersOpen((open) => !open)} />

      <div className="grid items-start gap-6 min-[100rem]:grid-cols-[minmax(0,1fr)_420px]">
        <ReservationsTable results={results} selectedId={selected?.id ?? null} onSelect={select} selection={selection} />
        <div id={DETAIL_ID} className="scroll-mt-24 min-[100rem]:sticky min-[100rem]:top-24">
          <ReservationsDetail
            reservation={selected}
            onAdvance={() => {
              if (!selected) return;
              const next = nextStatus(selected.status);
              if (!next) return;
              store.advance(selected.id);
              flash(`Réservation ${selected.reference} : ${next === "en_cours" ? "séjour démarré" : "séjour clôturé"}`);
            }}
          />
        </div>
      </div>

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-7 z-30 flex justify-center px-4">
        {toast ? (
          <p role="status" className="rounded-2xl bg-brand-950 px-5 py-3 text-sm font-semibold text-white shadow-xl dark:bg-brand-100 dark:text-brand-950">
            {toast}
          </p>
        ) : null}
      </div>
    </div>
  );
}
