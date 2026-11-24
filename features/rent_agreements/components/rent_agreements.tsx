"use client";

import { useRef, useState } from "react";
import { terminationEffectiveDate } from "../hooks/rent_agreements_status";
import { useRentAgreementsData } from "../hooks/use_rent_agreements_data";
import { useRentAgreementsKpis } from "../hooks/use_rent_agreements_kpis";
import { useRentAgreementsList } from "../hooks/use_rent_agreements_list";
import { useRentAgreementsSelection } from "../hooks/use_rent_agreements_selection";
import { useRentAgreementsStore } from "../hooks/use_rent_agreements_store";
import type { RentAgreement } from "../types";
import { RentAgreementsDetail } from "./rent_agreements_detail";
import { RentAgreementsFilters } from "./rent_agreements_filters";
import { RentAgreementsKpi } from "./rent_agreements_kpi";
import { RentAgreementsTable } from "./rent_agreements_table";
import { RentTerminateDialog } from "./rent_agreements_terminate_dialog";

const DETAIL_ID = "rent-agreement-detail";

/** "Contrats de location": leases, each attached to a management agreement and a property. */
export function RentAgreements() {
  const { data } = useRentAgreementsData();
  const store = useRentAgreementsStore(data.agreements);
  const kpis = useRentAgreementsKpis(store.agreements, data.asOf, data.activeHistory);
  const list = useRentAgreementsList(store.agreements, data.asOf);
  const selection = useRentAgreementsSelection(list.results.map((agreement) => agreement.id));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [terminating, setTerminating] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selected = list.results.find((agreement) => agreement.id === selectedId) ?? list.results[0] ?? null;
  const effectiveDate = terminationEffectiveDate(data.asOf);

  const flash = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3200);
  };

  const select = (agreement: RentAgreement) => {
    setSelectedId(agreement.id);
    // Below 1600px the panel sits under the table: bring it into view.
    if (!window.matchMedia("(min-width: 100rem)").matches) {
      document.getElementById(DETAIL_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">Contrats de location</h1>
        <p className="mt-1 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
          Chaque location s&apos;appuie sur un contrat de gestion et un bien : suivez les loyers, les cautions et les échéances.
        </p>
      </header>

      <RentAgreementsKpi kpis={kpis} onShowFinished={() => list.setTab("termine")} onShowUpcoming={() => list.setTab("a_venir")} />

      <RentAgreementsFilters list={list} open={filtersOpen} onToggle={() => setFiltersOpen((open) => !open)} />

      <div className="grid items-start gap-6 min-[100rem]:grid-cols-[minmax(0,1fr)_420px]">
        <RentAgreementsTable
          results={list.results}
          asOf={data.asOf}
          selectedId={selected?.id ?? null}
          onSelect={select}
          selection={selection}
        />
        <div id={DETAIL_ID} className="scroll-mt-24 min-[100rem]:sticky min-[100rem]:top-24">
          <RentAgreementsDetail agreement={selected} asOf={data.asOf} onTerminate={() => setTerminating(true)} />
        </div>
      </div>

      <RentTerminateDialog
        agreement={selected}
        effectiveDate={effectiveDate}
        open={terminating}
        onOpenChange={setTerminating}
        onConfirm={(reason) => {
          if (!selected) return;
          store.terminate(selected.id, reason, effectiveDate);
          flash(`Contrat ${selected.reference} résilié`);
        }}
      />

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
