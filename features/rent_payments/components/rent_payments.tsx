"use client";

import { WorkspaceScopeNotice } from "@/features/workspace/components";
import { ExportActions } from "@/components/ui/export_actions";
import { useRentPaymentsData } from "../hooks/use_rent_payments_data";
import { useRentPaymentsKpis } from "../hooks/use_rent_payments_kpis";
import { DEFAULT_RENT_PAYMENT_FILTERS, useRentPaymentsList } from "../hooks/use_rent_payments_list";
import { useRentPaymentsInScope } from "../hooks/use_rent_payments_scope";
import { RentPaymentsFilters, RentPaymentsQuickFilters } from "./rent_payments_filters";
import { RentPaymentsKpi } from "./rent_payments_kpi";
import { RentPaymentsSearch } from "./rent_payments_search";
import { rentPaymentsExportTable, RentPaymentsTable } from "./rent_payments_table";

/** Rent payments page: who paid, who still owes, and how much. */
export function RentPayments() {
  const { data } = useRentPaymentsData();
  const payments = useRentPaymentsInScope(data.payments);
  const kpis = useRentPaymentsKpis(payments, data.asOf);
  const list = useRentPaymentsList(payments, data.asOf);

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">Paiements de loyer</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Qui a payé, qui doit encore, et de combien.</p>
        <WorkspaceScopeNotice className="mt-3" />
      </header>

      <RentPaymentsKpi
        kpis={kpis}
        onShowLate={() => {
          list.setFilters(DEFAULT_RENT_PAYMENT_FILTERS);
          list.setQuick("en_retard");
        }}
      />

      <section aria-label="Recherche et filtres" className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <RentPaymentsSearch query={list.query} onQueryChange={list.setQuery} className="flex-1" />
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between xl:justify-start">
            <RentPaymentsFilters
              filters={list.filters}
              onFiltersChange={list.setFilters}
              tenantOptions={list.tenantOptions}
              activeCount={list.activeFilterCount}
              onReset={list.resetFilters}
            />
            <ExportActions
              count={list.results.length}
              getTable={() => rentPaymentsExportTable(list.results, data.asOf)}
              className="shrink-0"
            />
          </div>
        </div>
        <RentPaymentsQuickFilters value={list.quick} options={list.quickOptions} onChange={list.setQuick} />
      </section>

      <RentPaymentsTable
        pageItems={list.pageItems}
        total={list.results.length}
        asOf={data.asOf}
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
    </div>
  );
}
