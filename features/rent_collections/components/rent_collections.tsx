"use client";

import { ExportActions } from "@/components/ui/export_actions";
import { useRentCollectionsData } from "../hooks/use_rent_collections_data";
import { useRentCollectionsDetail } from "../hooks/use_rent_collections_detail";
import { useRentCollectionsKpis } from "../hooks/use_rent_collections_kpis";
import { DEFAULT_RENT_COLLECTION_FILTERS, useRentCollectionsList } from "../hooks/use_rent_collections_list";
import type { RentCollection } from "../types";
import { RentCollectionsDetail } from "./rent_collections_detail";
import { RentCollectionsFilters, RentCollectionsQuickFilters } from "./rent_collections_filters";
import { RentCollectionsKpi } from "./rent_collections_kpi";
import { RentCollectionsSearch } from "./rent_collections_search";
import { rentCollectionsExportTable, RentCollectionsTable } from "./rent_collections_table";

const DETAIL_ID = "rent-collection-detail";

/** Rent collections page: KPIs, search & filters, the payments table and the selected payment's breakdown. */
export function RentCollections() {
  const { data } = useRentCollectionsData();
  const kpis = useRentCollectionsKpis(data.collections, data.previousMonthRent, data.escrowActive);
  const list = useRentCollectionsList(data.collections);
  const detail = useRentCollectionsDetail(list.pageItems);

  const select = (collection: RentCollection) => {
    detail.select(collection.id);
    // Below 1600px the panel sits under the table: bring it into view.
    if (!window.matchMedia("(min-width: 1600px)").matches) {
      document.getElementById(DETAIL_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">Encaissements</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Loyers, charges et cautions reçus, quittance par quittance.
        </p>
      </header>

      <RentCollectionsKpi
        kpis={kpis}
        onShowPending={() => {
          list.setFilters(DEFAULT_RENT_COLLECTION_FILTERS);
          list.setQuick("en_attente");
        }}
      />

      <section aria-label="Recherche et filtres" className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 2xl:flex-row 2xl:items-center">
          <RentCollectionsSearch query={list.query} onQueryChange={list.setQuery} className="flex-1" />
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between 2xl:justify-start">
            <RentCollectionsFilters
              filters={list.filters}
              onFiltersChange={list.setFilters}
              tenantOptions={list.tenantOptions}
              activeCount={list.activeFilterCount}
              onReset={list.resetFilters}
            />
            <ExportActions
              count={list.results.length}
              getTable={() => rentCollectionsExportTable(list.results)}
              className="shrink-0"
            />
          </div>
        </div>
        <RentCollectionsQuickFilters value={list.quick} options={list.quickOptions} onChange={list.setQuick} />
      </section>

      <div className="grid items-start gap-6 min-[100rem]:grid-cols-[minmax(0,1fr)_380px]">
        <RentCollectionsTable
          pageItems={list.pageItems}
          total={list.results.length}
          selectedId={detail.selected?.id ?? null}
          onSelect={select}
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
        <div id={DETAIL_ID} className="scroll-mt-24 min-[100rem]:sticky min-[100rem]:top-24">
          <RentCollectionsDetail collection={detail.selected} />
        </div>
      </div>
    </div>
  );
}
