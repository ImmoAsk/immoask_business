"use client";

import { WorkspaceScopeNotice } from "@/features/workspace/components";
import { useRef, useState } from "react";
import { useVersementsData } from "../hooks/use_versements_data";
import { useVersementsKpis } from "../hooks/use_versements_kpis";
import { useVersementsList } from "../hooks/use_versements_list";
import { useVersementsInScope } from "../hooks/use_versements_scope";
import { useVersementsSelection } from "../hooks/use_versements_selection";
import type { Versement } from "../types";
import { VersementsDetail } from "./versements_detail";
import { VersementsFilters } from "./versements_filters";
import { VersementsKpi } from "./versements_kpi";
import { VersementsTable } from "./versements_table";

const DETAIL_ID = "versement-detail";

/** "Versements": sums paid out by the manager on each management contract, with their proof. */
export function Versements() {
  const { data } = useVersementsData();
  const versements = useVersementsInScope(data.versements);
  const kpis = useVersementsKpis(versements, data.asOf, data.history);
  const list = useVersementsList(versements, data.asOf);
  const selection = useVersementsSelection(list.results.map((versement) => versement.id));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const results = list.results;
  const selected = results.find((versement) => versement.id === selectedId) ?? results[0] ?? null;

  const flash = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3200);
  };

  const select = (versement: Versement) => {
    setSelectedId(versement.id);
    // Below 1600px the panel sits under the table: bring it into view.
    if (!window.matchMedia("(min-width: 100rem)").matches) {
      document.getElementById(DETAIL_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">Versements</h1>
        <p className="mt-1 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
          Suivez les sommes reversées par le gestionnaire sur chaque contrat de gestion : loyers, cautions et services, avec leur justificatif.
        </p>
        <WorkspaceScopeNotice className="mt-3" />
      </header>

      <VersementsKpi kpis={kpis} />

      <VersementsFilters list={list} open={filtersOpen} onToggle={() => setFiltersOpen((open) => !open)} />

      <div className="grid items-start gap-6 min-[100rem]:grid-cols-[minmax(0,1fr)_420px]">
        <VersementsTable results={results} asOf={data.asOf} selectedId={selected?.id ?? null} onSelect={select} selection={selection} />
        <div id={DETAIL_ID} className="scroll-mt-24 min-[100rem]:sticky min-[100rem]:top-24">
          <VersementsDetail
            versement={selected}
            asOf={data.asOf}
            onDownload={() => flash("Le téléchargement des pièces jointes arrive bientôt")}
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
