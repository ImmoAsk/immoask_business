"use client";

import { WorkspaceScopeNotice } from "@/features/workspace/components";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { isLeaseEndingSoon } from "../hooks/locataires_dates";
import { useLocatairesData } from "../hooks/use_locataires_data";
import { useLocatairesKpis } from "../hooks/use_locataires_kpis";
import { DEFAULT_LOCATAIRE_FILTERS, useLocatairesList } from "../hooks/use_locataires_list";
import { useLocatairesInScope } from "../hooks/use_locataires_scope";
import { useLocatairesSelection } from "../hooks/use_locataires_selection";
import type { LocataireView } from "../types";
import { LocatairesCard } from "./locataires_card";
import { LocatairesFilters, LocatairesQuickFilters, LocatairesViewSwitch } from "./locataires_filters";
import { LocatairesKpi } from "./locataires_kpi";
import { LocatairesMap } from "./locataires_map";
import { LocatairesPagination } from "./locataires_pagination";
import { LocatairesSearch } from "./locataires_search";
import { locatairesPanel } from "./locataires_styles";
import { LocatairesTable } from "./locataires_table";

/** Tenants page: KPIs, search & filters, then a table or a list beside a map. */
export function Locataires() {
  const { data } = useLocatairesData();
  const { locataires, activeHistory, upToDateRateHistory } = useLocatairesInScope(data);
  const kpis = useLocatairesKpis(locataires, data.asOf, activeHistory, upToDateRateHistory);
  const list = useLocatairesList(locataires, data.asOf);
  const selection = useLocatairesSelection(list.results.map((locataire) => locataire.id));
  const [view, setView] = useState<LocataireView>("tableau");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const pagination = {
    page: list.page,
    pageCount: list.pageCount,
    onPageChange: list.setPage,
    range: list.range,
    total: list.results.length,
  };

  const showQuick = (quick: "en_retard" | "fin_bail") => {
    list.setFilters(DEFAULT_LOCATAIRE_FILTERS);
    list.setQuick(quick);
  };

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">Locataires</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Suivez et gérez facilement tous vos locataires.</p>
        <WorkspaceScopeNotice className="mt-3" />
      </header>

      <LocatairesKpi
        kpis={kpis}
        onShowLate={() => showQuick("en_retard")}
        onShowRenewals={() => showQuick("fin_bail")}
      />

      <section aria-label="Recherche et filtres" className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <LocatairesSearch query={list.query} onQueryChange={list.setQuery} className="flex-1" />
          <LocatairesFilters
            filters={list.filters}
            onFiltersChange={list.setFilters}
            areaOptions={list.areaOptions}
            activeCount={list.activeFilterCount}
            onReset={list.resetFilters}
          />
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <LocatairesQuickFilters value={list.quick} options={list.quickOptions} onChange={list.setQuick} />
          <LocatairesViewSwitch view={view} onViewChange={setView} />
        </div>
      </section>

      {view === "tableau" ? (
        <LocatairesTable
          results={list.results}
          pageItems={list.pageItems}
          asOf={data.asOf}
          selection={selection}
          pagination={{ ...pagination, pageSize: list.pageSize, onPageSizeChange: list.setPageSize }}
        />
      ) : (
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <section aria-labelledby="locataires-list-title" className={cn(locatairesPanel, "overflow-hidden")}>
            <h2
              id="locataires-list-title"
              className="border-b border-zinc-100 px-6 py-4 text-lg font-semibold text-zinc-950 dark:border-white/10 dark:text-zinc-50"
            >
              {list.results.length} locataire{list.results.length > 1 ? "s" : ""} trouvé
              {list.results.length > 1 ? "s" : ""}
            </h2>
            <ul className="flex flex-col gap-1 p-3">
              {list.pageItems.map((locataire) => (
                <li key={locataire.id}>
                  <LocatairesCard
                    locataire={locataire}
                    leaseEndingSoon={isLeaseEndingSoon(locataire.lease.endDate, data.asOf)}
                    selected={locataire.id === selectedId}
                    onSelect={(item) => setSelectedId(item.id === selectedId ? null : item.id)}
                    onHover={(item) => setHoveredId(item?.id ?? null)}
                  />
                </li>
              ))}
            </ul>
            <LocatairesPagination {...pagination} className="border-t border-zinc-100 px-6 py-4 dark:border-white/10" />
          </section>
          <LocatairesMap
            fill
            locataires={list.results}
            asOf={data.asOf}
            selectedId={selectedId}
            onSelect={setSelectedId}
            highlightedId={hoveredId}
            className="order-first h-[420px] sm:h-[520px] xl:sticky xl:top-24 xl:order-last xl:h-[calc(100dvh-8rem)] xl:max-h-[760px]"
          />
        </div>
      )}
    </div>
  );
}
