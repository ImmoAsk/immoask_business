"use client";

import { useState } from "react";
import { WorkspaceScopeNotice } from "@/features/workspace/components";
import { useComptabilitesData } from "../hooks/use_comptabilites_data";
import { useComptabilitesKpis } from "../hooks/use_comptabilites_kpis";
import { useComptabilitesList } from "../hooks/use_comptabilites_list";
import { useComptabilitesInScope } from "../hooks/use_comptabilites_scope";
import type { ComptabiliteView } from "../types";
import { ComptabilitesBreakdown } from "./comptabilites_breakdown";
import { ComptabilitesCategoryChart } from "./comptabilites_category_chart";
import { ComptabilitesAdvancedFilters, ComptabilitesFilters, ComptabilitesViewSwitch } from "./comptabilites_filters";
import { ComptabilitesKpi } from "./comptabilites_kpi";
import { ComptabilitesOverviewChart } from "./comptabilites_overview_chart";
import { monthLong } from "./comptabilites_parts";
import { ComptabilitesSearch } from "./comptabilites_search";
import { ComptabilitesTable } from "./comptabilites_table";

/** Accounting page: monthly figures, trends, breakdowns and the operations of the month. */
export function Comptabilites() {
  const { data } = useComptabilitesData();
  // The header's management contract decides whose books are shown.
  const books = useComptabilitesInScope(data);
  const { kpis, series, incomeBreakdown, expenseBreakdown } = useComptabilitesKpis(books);
  const list = useComptabilitesList(books.operations, books.asOf);
  const [view, setView] = useState<ComptabiliteView>("tableau");
  const [advancedOpen, setAdvancedOpen] = useState(false);

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">Comptabilité</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Recettes, dépenses et solde de {monthLong(data.asOf.slice(0, 7))}, opération par opération.
        </p>
        <WorkspaceScopeNotice className="mt-3" />
      </header>

      <ComptabilitesKpi kpis={kpis} />

      <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <ComptabilitesOverviewChart series={series} className="lg:col-span-2 2xl:col-span-1" />
        <ComptabilitesBreakdown title="Répartition des revenus" total={incomeBreakdown.total} slices={incomeBreakdown.slices} />
        <ComptabilitesBreakdown title="Répartition des dépenses" total={expenseBreakdown.total} slices={expenseBreakdown.slices} />
      </div>

      <section aria-label="Recherche et filtres" className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 2xl:flex-row 2xl:items-center">
          <ComptabilitesSearch query={list.query} onQueryChange={list.setQuery} className="flex-1" />
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between 2xl:justify-start">
            <ComptabilitesFilters
              filters={list.filters}
              onFiltersChange={list.setFilters}
              advancedOpen={advancedOpen}
              onAdvancedToggle={() => setAdvancedOpen((open) => !open)}
              advancedCount={list.advancedCount}
            />
            <ComptabilitesViewSwitch view={view} onViewChange={setView} />
          </div>
        </div>
        {advancedOpen ? (
          <ComptabilitesAdvancedFilters
            advanced={list.advanced}
            onAdvancedChange={list.setAdvanced}
            biens={list.biens}
            onResetAll={list.resetAll}
          />
        ) : null}
      </section>

      {view === "tableau" ? (
        <ComptabilitesTable
          results={list.results}
          pageItems={list.pageItems}
          sort={list.sort}
          onSort={list.toggleSort}
          pagination={{
            page: list.page,
            pageCount: list.pageCount,
            onPageChange: list.setPage,
            range: list.range,
            total: list.results.length,
            pageSize: list.pageSize,
            onPageSizeChange: list.setPageSize,
          }}
        />
      ) : (
        <ComptabilitesCategoryChart results={list.results} />
      )}
    </div>
  );
}
