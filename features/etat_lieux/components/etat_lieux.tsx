"use client";

import { WorkspaceScopeNotice } from "@/features/workspace/components";
import { useRef, useState } from "react";
import { inventoryLines } from "../hooks/etat_lieux_items";
import { useEtatLieuxData } from "../hooks/use_etat_lieux_data";
import { useEtatLieuxKpis } from "../hooks/use_etat_lieux_kpis";
import { useEtatLieuxList } from "../hooks/use_etat_lieux_list";
import { useEtatLieuxInScope } from "../hooks/use_etat_lieux_scope";
import { useEtatLieuxSelection } from "../hooks/use_etat_lieux_selection";
import type { InventoryLine } from "../types";
import { EtatLieuxDetail } from "./etat_lieux_detail";
import { EtatLieuxFilters } from "./etat_lieux_filters";
import { EtatLieuxKpi } from "./etat_lieux_kpi";
import { EtatLieuxTable } from "./etat_lieux_table";

const DETAIL_ID = "etat-lieux-detail";

/** "Inventaires": move-in and move-out inventories, item by item, with photos. */
export function EtatLieux() {
  const { data } = useEtatLieuxData();
  // Every line stays available to compare an exit with its entry, even outside the selected month.
  const lines = inventoryLines(data.inventories);
  const inventories = useEtatLieuxInScope(data.inventories);
  const scopedLines = inventoryLines(inventories);
  const kpis = useEtatLieuxKpis(inventories, scopedLines, data.history);
  const list = useEtatLieuxList(scopedLines);
  const selection = useEtatLieuxSelection(list.results.map((line) => line.id));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const results = list.results;
  const selected = results.find((line) => line.id === selectedId) ?? results[0] ?? null;

  const flash = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3200);
  };

  const select = (line: InventoryLine) => {
    setSelectedId(line.id);
    // Below 1600px the panel sits under the table: bring it into view.
    if (!window.matchMedia("(min-width: 100rem)").matches) {
      document.getElementById(DETAIL_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">Inventaires</h1>
        <p className="mt-1 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
          Documentez l&apos;état de chaque élément d&apos;un bien à l&apos;entrée et à la sortie du locataire, photos à l&apos;appui, pour comparer et
          chiffrer les dégradations.
        </p>
        <WorkspaceScopeNotice className="mt-3" />
      </header>

      <EtatLieuxKpi kpis={kpis} onShowDamaged={() => list.setTab("endommage")} />

      <EtatLieuxFilters list={list} open={filtersOpen} onToggle={() => setFiltersOpen((open) => !open)} />

      <div className="grid items-start gap-6 min-[100rem]:grid-cols-[minmax(0,1fr)_420px]">
        <EtatLieuxTable results={results} asOf={data.asOf} selectedId={selected?.id ?? null} onSelect={select} selection={selection} />
        <div id={DETAIL_ID} className="scroll-mt-24 min-[100rem]:sticky min-[100rem]:top-24">
          <EtatLieuxDetail
            // A new item starts on its first photo.
            key={selected?.id}
            line={selected}
            lines={lines}
            asOf={data.asOf}
            onShowInventory={() => selected && list.showInventory(selected.inventory.reference)}
            onAddPhoto={() => flash("L'ajout de photos arrive bientôt")}
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
