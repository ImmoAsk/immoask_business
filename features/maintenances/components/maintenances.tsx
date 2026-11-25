"use client";

import { useRef, useState } from "react";
import { nextStatus } from "../hooks/maintenances_age";
import { useMaintenancesData } from "../hooks/use_maintenances_data";
import { useMaintenancesKpis } from "../hooks/use_maintenances_kpis";
import { useMaintenancesList } from "../hooks/use_maintenances_list";
import { useMaintenancesSelection } from "../hooks/use_maintenances_selection";
import { useMaintenancesStore } from "../hooks/use_maintenances_store";
import type { Maintenance } from "../types";
import { MaintenancesDetail } from "./maintenances_detail";
import { MaintenancesFilters } from "./maintenances_filters";
import { MaintenancesKpi } from "./maintenances_kpi";
import { MaintenancesTable } from "./maintenances_table";

const DETAIL_ID = "maintenance-detail";

/** "Maintenances": repair requests on managed properties, from creation to resolution. */
export function Maintenances() {
  const { data } = useMaintenancesData();
  const store = useMaintenancesStore(data.maintenances);
  const kpis = useMaintenancesKpis(store.maintenances, data.asOf, data.newHistory);
  const list = useMaintenancesList(store.maintenances, data.asOf);
  const selection = useMaintenancesSelection(list.results.map((maintenance) => maintenance.id));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const results = list.results;
  const selected = results.find((maintenance) => maintenance.id === selectedId) ?? results[0] ?? null;

  const flash = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3200);
  };

  const select = (maintenance: Maintenance) => {
    setSelectedId(maintenance.id);
    // Below 1600px the panel sits under the table: bring it into view.
    if (!window.matchMedia("(min-width: 100rem)").matches) {
      document.getElementById(DETAIL_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">Maintenances</h1>
        <p className="mt-1 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
          Suivez les demandes d&apos;intervention sur vos biens, de la création à la résolution, avec leur photo et leur catégorie.
        </p>
      </header>

      <MaintenancesKpi
        kpis={kpis}
        onShowStale={() => {
          list.showStale();
          setFiltersOpen(true);
        }}
        onShowInProgress={() => list.setTab("en_traitement")}
      />

      <MaintenancesFilters list={list} open={filtersOpen} onToggle={() => setFiltersOpen((open) => !open)} />

      <div className="grid items-start gap-6 min-[100rem]:grid-cols-[minmax(0,1fr)_420px]">
        <MaintenancesTable results={results} asOf={data.asOf} selectedId={selected?.id ?? null} onSelect={select} selection={selection} />
        <div id={DETAIL_ID} className="scroll-mt-24 min-[100rem]:sticky min-[100rem]:top-24">
          <MaintenancesDetail
            maintenance={selected}
            asOf={data.asOf}
            onAdvance={() => {
              if (!selected) return;
              const next = nextStatus(selected.status);
              if (!next) return;
              store.advance(selected.id);
              flash(`${selected.reference} : ${next === "en_traitement" ? "traitement démarré" : "maintenance résolue"}`);
            }}
            onAssign={() => flash("L'affectation d'un prestataire arrive bientôt")}
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
