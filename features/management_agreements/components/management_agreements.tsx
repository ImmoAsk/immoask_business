"use client";

import { useRef, useState } from "react";
import { terminationEffectiveDate } from "../hooks/management_agreements_money";
import { useManagementAgreementsData } from "../hooks/use_management_agreements_data";
import { useManagementAgreementsKpis } from "../hooks/use_management_agreements_kpis";
import { DEFAULT_MANAGEMENT_FILTERS, useManagementAgreementsList } from "../hooks/use_management_agreements_list";
import { useManagementAgreementsSelection } from "../hooks/use_management_agreements_selection";
import { useManagementAgreementsStore } from "../hooks/use_management_agreements_store";
import type { ManagementAgreement } from "../types";
import { ManagementAgreementsDetail } from "./management_agreements_detail";
import { AssignBienDialog, TerminateDialog } from "./management_agreements_dialogs";
import { ManagementAgreementsFilters } from "./management_agreements_filters";
import { ManagementAgreementsKpi } from "./management_agreements_kpi";
import { ManagementAgreementsTable } from "./management_agreements_table";

const DETAIL_ID = "management-agreement-detail";

/** "Contrats de gestion": mandates signed with owners, their remuneration and properties. */
export function ManagementAgreements() {
  const { data } = useManagementAgreementsData();
  const store = useManagementAgreementsStore(data.agreements, data.availableBiens);
  const kpis = useManagementAgreementsKpis(store.agreements, data.activeHistory);
  const list = useManagementAgreementsList(store.agreements);
  const selection = useManagementAgreementsSelection(list.results.map((agreement) => agreement.id));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<"assign" | "terminate" | null>(null);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selected = list.results.find((agreement) => agreement.id === selectedId) ?? list.results[0] ?? null;
  const effectiveDate = terminationEffectiveDate(data.asOf);

  const flash = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3200);
  };

  const select = (agreement: ManagementAgreement) => {
    setSelectedId(agreement.id);
    // Below 1600px the panel sits under the table: bring it into view.
    if (!window.matchMedia("(min-width: 100rem)").matches) {
      document.getElementById(DETAIL_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">Contrats de gestion</h1>
        <p className="mt-1 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
          Suivez les mandats confiés à l&apos;agence, la rémunération du gestionnaire et les biens affectés à chaque propriétaire.
        </p>
      </header>

      <ManagementAgreementsKpi
        kpis={kpis}
        onShowPending={() => list.setTab("en_attente")}
        onShowAssigned={() => {
          list.setTab("actif");
          list.setFilters({ ...DEFAULT_MANAGEMENT_FILTERS, biens: "avec" });
        }}
      />

      <ManagementAgreementsFilters list={list} open={filtersOpen} onToggle={() => setFiltersOpen((open) => !open)} />

      <div className="grid items-start gap-6 min-[100rem]:grid-cols-[minmax(0,1fr)_420px]">
        <ManagementAgreementsTable results={list.results} selectedId={selected?.id ?? null} onSelect={select} selection={selection} />
        <div id={DETAIL_ID} className="scroll-mt-24 min-[100rem]:sticky min-[100rem]:top-24">
          <ManagementAgreementsDetail
            agreement={selected}
            onAssign={() => setDialog("assign")}
            onTerminate={() => setDialog("terminate")}
          />
        </div>
      </div>

      <AssignBienDialog
        agreement={selected}
        available={store.available}
        open={dialog === "assign"}
        onOpenChange={(open) => setDialog(open ? "assign" : null)}
        onConfirm={(bien) => {
          if (!selected) return;
          store.assign(selected.id, bien);
          flash(`Bien affecté au contrat ${selected.reference}`);
        }}
      />
      <TerminateDialog
        agreement={selected}
        effectiveDate={effectiveDate}
        open={dialog === "terminate"}
        onOpenChange={(open) => setDialog(open ? "terminate" : null)}
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
