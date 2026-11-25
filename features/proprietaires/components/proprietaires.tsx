"use client";

import { WorkspaceScopeNotice } from "@/features/workspace/components";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { isMandateEndingSoon } from "../hooks/proprietaires_dates";
import { useProprietairesData } from "../hooks/use_proprietaires_data";
import { useProprietairesKpis } from "../hooks/use_proprietaires_kpis";
import { DEFAULT_PROPRIETAIRE_FILTERS, useProprietairesList } from "../hooks/use_proprietaires_list";
import { useProprietairesInScope } from "../hooks/use_proprietaires_scope";
import { useProprietairesSelection } from "../hooks/use_proprietaires_selection";
import type { ProprietaireQuickFilter, ProprietaireView } from "../types";
import { ProprietairesCard } from "./proprietaires_card";
import { ProprietairesFilters, ProprietairesQuickFilters, ProprietairesViewSwitch } from "./proprietaires_filters";
import { ProprietairesKpi } from "./proprietaires_kpi";
import { proprietaireMarkerId, ProprietairesMap } from "./proprietaires_map";
import { ProprietairesPagination } from "./proprietaires_pagination";
import { ProprietairesSearch } from "./proprietaires_search";
import { proprietairesPanel } from "./proprietaires_styles";
import { ProprietairesTable } from "./proprietaires_table";

/** Owners page: KPIs, search & filters, then a table or a list beside a map of their properties. */
export function Proprietaires() {
  const { data } = useProprietairesData();
  const { proprietaires, ownersHistory } = useProprietairesInScope(data);
  const kpis = useProprietairesKpis(proprietaires, data.asOf, ownersHistory);
  const list = useProprietairesList(proprietaires, data.asOf);
  const selection = useProprietairesSelection(list.results.map((proprietaire) => proprietaire.id));
  const [view, setView] = useState<ProprietaireView>("tableau");
  /** Selected property on the map; its owner is highlighted in the list. */
  const [selectedBienId, setSelectedBienId] = useState<string | null>(null);
  const [hoveredOwnerId, setHoveredOwnerId] = useState<string | null>(null);
  const selectedOwnerId =
    proprietaires.find((proprietaire) => proprietaire.biens.some((bien) => bien.id === selectedBienId))?.id ?? null;

  const pagination = {
    page: list.page,
    pageCount: list.pageCount,
    onPageChange: list.setPage,
    range: list.range,
    total: list.results.length,
  };

  const showQuick = (quick: ProprietaireQuickFilter) => {
    list.setFilters(DEFAULT_PROPRIETAIRE_FILTERS);
    list.setQuick(quick);
  };

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">Propriétaires</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Suivez vos mandants, leurs portefeuilles et leurs reversements.
        </p>
        <WorkspaceScopeNotice className="mt-3" />
      </header>

      <ProprietairesKpi
        kpis={kpis}
        onShowToPay={() => showQuick("a_reverser")}
        onShowRenewals={() => showQuick("fin_mandat")}
      />

      <section aria-label="Recherche et filtres" className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <ProprietairesSearch query={list.query} onQueryChange={list.setQuery} className="flex-1" />
          <ProprietairesFilters
            filters={list.filters}
            onFiltersChange={list.setFilters}
            communeOptions={list.communeOptions}
            activeCount={list.activeFilterCount}
            onReset={list.resetFilters}
          />
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <ProprietairesQuickFilters value={list.quick} options={list.quickOptions} onChange={list.setQuick} />
          <ProprietairesViewSwitch view={view} onViewChange={setView} />
        </div>
      </section>

      {view === "tableau" ? (
        <ProprietairesTable
          results={list.results}
          pageItems={list.pageItems}
          asOf={data.asOf}
          selection={selection}
          pagination={{ ...pagination, pageSize: list.pageSize, onPageSizeChange: list.setPageSize }}
        />
      ) : (
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <section aria-labelledby="proprietaires-list-title" className={cn(proprietairesPanel, "overflow-hidden")}>
            <h2
              id="proprietaires-list-title"
              className="border-b border-zinc-100 px-6 py-4 text-lg font-semibold text-zinc-950 dark:border-white/10 dark:text-zinc-50"
            >
              {list.results.length} propriétaire{list.results.length > 1 ? "s" : ""} trouvé
              {list.results.length > 1 ? "s" : ""}
            </h2>
            <ul className="flex flex-col gap-1 p-3">
              {list.pageItems.map((proprietaire) => (
                <li key={proprietaire.id}>
                  <ProprietairesCard
                    proprietaire={proprietaire}
                    mandateEndingSoon={isMandateEndingSoon(proprietaire.mandate.endDate, data.asOf)}
                    selected={proprietaire.id === selectedOwnerId}
                    onSelect={(item) =>
                      setSelectedBienId(item.id === selectedOwnerId ? null : proprietaireMarkerId(item.biens[0]))
                    }
                    onHover={(item) => setHoveredOwnerId(item?.id ?? null)}
                  />
                </li>
              ))}
            </ul>
            <ProprietairesPagination {...pagination} className="border-t border-zinc-100 px-6 py-4 dark:border-white/10" />
          </section>
          <ProprietairesMap
            fill
            proprietaires={list.results}
            selectedId={selectedBienId}
            onSelect={setSelectedBienId}
            highlightedOwnerId={hoveredOwnerId ?? selectedOwnerId}
            className="order-first h-[420px] sm:h-[520px] xl:sticky xl:top-24 xl:order-last xl:h-[calc(100dvh-8rem)] xl:max-h-[760px]"
          />
        </div>
      )}
    </div>
  );
}
