"use client";

import { ExportActions } from "@/components/ui/export_actions";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import type { ExportTable } from "@/lib/utils/export";
import { COMPTABILITE_CATEGORIES } from "../hooks/comptabilites_categories";
import type { ComptabiliteOperation, ComptabiliteSort } from "../types";
import { ComptabilitesCard } from "./comptabilites_card";
import type { ComptabilitesPaginationProps } from "./comptabilites_pagination";
import { ComptabilitesPagination } from "./comptabilites_pagination";
import { AmountText, CategoryCell, formatDateNumeric, StatusBadge } from "./comptabilites_parts";
import { ComptabilitesRowMenu } from "./comptabilites_row_menu";
import { comptabilitesPanel, statusStyle } from "./comptabilites_styles";

const headCell = "px-3 py-3.5 text-left text-[13px] font-semibold whitespace-nowrap text-zinc-600 dark:text-zinc-300";

export type ComptabilitesTableProps = {
  results: ComptabiliteOperation[];
  pageItems: ComptabiliteOperation[];
  sort: ComptabiliteSort;
  onSort: (key: ComptabiliteSort["key"]) => void;
  pagination: ComptabilitesPaginationProps;
  className?: string;
};

export function ComptabilitesTable({ results, pageItems, sort, onSort, pagination, className }: ComptabilitesTableProps) {
  return (
    <section aria-labelledby="comptabilites-table-title" className={cn(comptabilitesPanel, className)}>
      <OperationsHeader results={results} title="Dernières opérations" id="comptabilites-table-title" icon="receipt" />

      {results.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[960px] table-fixed border-collapse text-sm">
              <thead className="bg-zinc-50/80 dark:bg-white/5">
                <tr>
                  <SortHeader label="Date" sortKey="date" sort={sort} onSort={onSort} className="w-30 pl-6" />
                  <th scope="col" className={cn(headCell, "w-40")}>Type</th>
                  <th scope="col" className={cn(headCell, "w-[24%]")}>Description</th>
                  <th scope="col" className={cn(headCell, "w-[19%]")}>Bien concerné</th>
                  <th scope="col" className={cn(headCell, "w-[17%]")}>Locataire / Tiers</th>
                  <SortHeader label="Montant (FCFA)" sortKey="amount" sort={sort} onSort={onSort} className="w-36" align="right" />
                  <th scope="col" className={cn(headCell, "w-32 pl-5")}>Statut</th>
                  <th scope="col" className={cn(headCell, "w-20 pr-6 text-right")}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-white/10">
                {pageItems.map((operation) => (
                  <tr key={operation.id} className="align-middle transition-colors hover:bg-zinc-50/70 dark:hover:bg-white/[0.03]">
                    <td className="py-3.5 pr-3 pl-6 whitespace-nowrap text-zinc-700 tabular-nums dark:text-zinc-300">
                      {formatDateNumeric(operation.date)}
                    </td>
                    <td className="px-3 py-3.5">
                      <CategoryCell operation={operation} />
                    </td>
                    <td className="truncate px-3 py-3.5 text-zinc-900 dark:text-zinc-100" title={operation.description}>
                      {operation.description}
                    </td>
                    <td className="truncate px-3 py-3.5 text-zinc-700 dark:text-zinc-300" title={operation.bien}>
                      {operation.bien}
                    </td>
                    <td className="truncate px-3 py-3.5 text-zinc-700 dark:text-zinc-300" title={operation.counterparty}>
                      {operation.counterparty ?? <span className="text-zinc-400">—</span>}
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <AmountText operation={operation} />
                    </td>
                    <td className="py-3.5 pr-3 pl-5">
                      <StatusBadge operation={operation} />
                    </td>
                    <td className="py-3.5 pr-6 pl-3">
                      <div className="flex justify-end">
                        <ComptabilitesRowMenu operation={operation} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="flex flex-col gap-1 p-3 lg:hidden">
            {pageItems.map((operation) => (
              <li key={operation.id}>
                <ComptabilitesCard operation={operation} />
              </li>
            ))}
          </ul>
        </>
      )}

      <ComptabilitesPagination {...pagination} className="border-t border-zinc-100 px-6 py-4 dark:border-white/10" />
    </section>
  );
}

/** Title, totals of the filtered operations and the export buttons (shared with the chart view). */
export function OperationsHeader({
  results,
  title,
  id,
  icon,
}: {
  results: ComptabiliteOperation[];
  title: string;
  id: string;
  icon: "receipt" | "trendUp";
}) {
  const income = results.filter((operation) => operation.flow === "recette").reduce((sum, operation) => sum + operation.amount, 0);
  const expenses = results.filter((operation) => operation.flow === "depense").reduce((sum, operation) => sum + operation.amount, 0);
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-6 py-4 dark:border-white/10">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/60 dark:text-brand-100">
          <Icon name={icon} className="size-5" />
        </span>
        <div>
          <h2 id={id} className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            {title}
          </h2>
          <p className="text-xs text-zinc-500 tabular-nums dark:text-zinc-400">
            {results.length} opération{results.length > 1 ? "s" : ""} · Recettes {income.toLocaleString("fr-FR")} · Dépenses{" "}
            {expenses.toLocaleString("fr-FR")} FCFA
          </p>
        </div>
      </div>
      <ExportActions count={results.length} getTable={() => comptabilitesExportTable(results)} />
    </div>
  );
}

function SortHeader({
  label,
  sortKey,
  sort,
  onSort,
  className,
  align = "left",
}: {
  label: string;
  sortKey: ComptabiliteSort["key"];
  sort: ComptabiliteSort;
  onSort: (key: ComptabiliteSort["key"]) => void;
  className?: string;
  align?: "left" | "right";
}) {
  const active = sort.key === sortKey;
  return (
    <th
      scope="col"
      aria-sort={active ? (sort.direction === "asc" ? "ascending" : "descending") : "none"}
      className={cn(headCell, align === "right" && "text-right", className)}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          "inline-flex cursor-pointer items-center gap-1 rounded hover:text-zinc-950 dark:hover:text-white",
          active && "text-brand-700 dark:text-brand-100",
          focusRing,
        )}
      >
        {label}
        <Icon
          name="chevronDown"
          className={cn("size-3.5 transition-transform", active && sort.direction === "asc" && "rotate-180", !active && "opacity-40")}
        />
      </button>
    </th>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-900/60 dark:text-brand-100">
        <Icon name="receipt" className="size-5" />
      </span>
      <p className="font-semibold text-zinc-900 dark:text-zinc-100">Aucune opération ne correspond</p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">Modifiez la recherche ou réinitialisez les filtres.</p>
    </div>
  );
}

/** Rows for the CSV / PDF export. */
export function comptabilitesExportTable(operations: ComptabiliteOperation[]): ExportTable {
  return {
    title: "Opérations comptables ImmoAsk",
    header: ["Référence", "Date", "Sens", "Catégorie", "Description", "Bien concerné", "Locataire / Tiers", "Montant (FCFA)", "Statut"],
    rows: operations.map((operation) => [
      operation.reference,
      formatDateNumeric(operation.date),
      operation.flow === "recette" ? "Recette" : "Dépense",
      COMPTABILITE_CATEGORIES[operation.category].label,
      operation.description,
      operation.bien,
      operation.counterparty ?? "",
      operation.flow === "recette" ? operation.amount : -operation.amount,
      statusStyle(operation.status, operation.flow).label,
    ]),
  };
}
