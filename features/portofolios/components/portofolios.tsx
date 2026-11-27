"use client";

import { WorkspaceScopeNotice } from "@/features/workspace/components";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { usePortofolioData } from "../hooks/use_portofolio_data";
import { usePortofolioKpis } from "../hooks/use_portofolio_kpis";
import { DEFAULT_PORTOFOLIO_FILTERS, usePortofolioList } from "../hooks/use_portofolio_list";
import { usePortofolioInScope } from "../hooks/use_portofolio_scope";
import { usePortofolioSelection } from "../hooks/use_portofolio_selection";
import type { PortofolioData, PortofolioView } from "../types";
import { PortofoliosAdvancedSearch } from "./portofolios_advanced_search";
import { PortofoliosBienCard } from "./portofolios_bien_card";
import { PortofoliosKpi } from "./portofolios_kpi";
import { PortofoliosMaps } from "./portofolios_maps";
import { PortofoliosPagination } from "./portofolios_pagination";
import { PortofoliosTableau } from "./portofolios_tableau";
import { portofolioPanel } from "./portofolios_styles";

const EMPTY: PortofolioData = { biens: [], revenueHistory: [] };

/** Portfolio page: KPIs, search & filters, then a table or a list beside a map. */
export function Portofolios() {
  const { data, isLoading, error } = usePortofolioData();
  const { biens, revenueHistory } = usePortofolioInScope(data ?? EMPTY);
  const kpis = usePortofolioKpis(biens, revenueHistory);
  const list = usePortofolioList(biens);
  const selection = usePortofolioSelection(list.results.map((bien) => bien.id));
  const [view, setView] = useState<PortofolioView>("tableau");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const pagination = {
    page: list.page,
    pageCount: list.pageCount,
    onPageChange: list.setPage,
    range: list.range,
    total: list.results.length,
  };

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">Portofolio</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Vos biens, leur occupation et leurs loyers en un coup d&apos;œil.
        </p>
        <WorkspaceScopeNotice className="mt-3" />
        {data ? null : (
          <p role="status" className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            {isLoading ? "Chargement des biens…" : `Biens indisponibles${error ? ` : ${error}` : ""}`}
          </p>
        )}
      </header>

      <PortofoliosKpi
        kpis={kpis}
        onShowAvailable={() => list.setFilters({ ...DEFAULT_PORTOFOLIO_FILTERS, status: "vacant" })}
      />

      <div className="flex flex-col gap-6">
        <PortofoliosAdvancedSearch
          query={list.query}
          onQueryChange={list.setQuery}
          filters={list.filters}
          onFiltersChange={list.setFilters}
          cityOptions={list.cityOptions}
          sort={list.sort}
          onSortChange={list.setSort}
          view={view}
          onViewChange={setView}
        />

        {view === "tableau" ? (
          <PortofoliosTableau
            results={list.results}
            pageItems={list.pageItems}
            selection={selection}
            pagination={{ ...pagination, pageSize: list.pageSize, onPageSizeChange: list.setPageSize }}
          />
        ) : (
          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
            <section aria-labelledby="portofolio-list-title" className={cn(portofolioPanel, "overflow-hidden xl:order-first")}>
              <h2
                id="portofolio-list-title"
                className="border-b border-zinc-100 px-6 py-4 text-lg font-semibold text-zinc-950 dark:border-white/10 dark:text-zinc-50"
              >
                {list.results.length} bien{list.results.length > 1 ? "s" : ""} trouvé
                {list.results.length > 1 ? "s" : ""}
              </h2>
              <ul className="flex flex-col gap-1 p-3">
                {list.pageItems.map((bien) => (
                  <li key={bien.id}>
                    <PortofoliosBienCard
                      bien={bien}
                      selected={bien.id === selectedId}
                      onSelect={(item) => setSelectedId(item.id === selectedId ? null : item.id)}
                      onHover={(item) => setHoveredId(item?.id ?? null)}
                    />
                  </li>
                ))}
              </ul>
              <PortofoliosPagination {...pagination} className="border-t border-zinc-100 px-6 py-4 dark:border-white/10" />
            </section>
            <PortofoliosMaps
              biens={list.results}
              selectedId={selectedId}
              onSelect={setSelectedId}
              highlightedId={hoveredId}
              className="order-first xl:sticky xl:top-24 xl:order-last"
            />
          </div>
        )}
      </div>
    </div>
  );
}
