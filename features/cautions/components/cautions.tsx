"use client";

import { WorkspaceScopeNotice } from "@/features/workspace/components";
import { useRef, useState } from "react";
import { usedAmount } from "../hooks/cautions_balance";
import { useCautionsData } from "../hooks/use_cautions_data";
import { useCautionsKpis } from "../hooks/use_cautions_kpis";
import { useCautionsList } from "../hooks/use_cautions_list";
import { useCautionsInScope } from "../hooks/use_cautions_scope";
import { useCautionsSelection } from "../hooks/use_cautions_selection";
import { useCautionsStore } from "../hooks/use_cautions_store";
import type { Caution } from "../types";
import { CautionsDetail } from "./cautions_detail";
import { CautionsFilters } from "./cautions_filters";
import { CautionsKpi } from "./cautions_kpi";
import { fcfa } from "./cautions_parts";
import { CautionsTable } from "./cautions_table";

const DETAIL_ID = "caution-detail";

/** "Cautions": tenants' security deposits held by the agency, and what was taken from them. */
export function Cautions() {
  const { data } = useCautionsData();
  const store = useCautionsStore(data.cautions);
  const cautions = useCautionsInScope(store.cautions);
  const kpis = useCautionsKpis(cautions, data.heldHistory);
  const list = useCautionsList(cautions, data.asOf);
  const selection = useCautionsSelection(list.results.map((caution) => caution.id));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const results = list.results;
  const selected = results.find((caution) => caution.id === selectedId) ?? results[0] ?? null;

  const flash = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3200);
  };

  const select = (caution: Caution) => {
    setSelectedId(caution.id);
    // Below 1600px the panel sits under the table: bring it into view.
    if (!window.matchMedia("(min-width: 100rem)").matches) {
      document.getElementById(DETAIL_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">Cautions</h1>
        <p className="mt-1 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
          Suivez le coffre de chaque locataire : la caution déposée, ce qui a servi à payer des loyers et ce qui reste à reconstituer.
        </p>
        <WorkspaceScopeNotice className="mt-3" />
      </header>

      <CautionsKpi kpis={kpis} onShowModified={() => list.setTab("modifiee")} />

      <CautionsFilters list={list} open={filtersOpen} onToggle={() => setFiltersOpen((open) => !open)} />

      <div className="grid items-start gap-6 min-[100rem]:grid-cols-[minmax(0,1fr)_420px]">
        <CautionsTable results={results} asOf={data.asOf} selectedId={selected?.id ?? null} onSelect={select} selection={selection} />
        <div id={DETAIL_ID} className="scroll-mt-24 min-[100rem]:sticky min-[100rem]:top-24">
          <CautionsDetail
            caution={selected}
            onReconstitute={() => {
              if (!selected) return;
              const used = usedAmount(selected);
              if (used <= 0) return;
              store.reconstitute(selected.id, data.asOf);
              flash(`Caution ${selected.reference} reconstituée : ${fcfa(used)}`);
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
