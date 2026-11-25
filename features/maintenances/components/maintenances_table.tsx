"use client";

import { ExportActions } from "@/components/ui/export_actions";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/utils/dates";
import { agoLabel, isStale } from "../hooks/maintenances_age";
import type { UseMaintenancesSelectionResult } from "../hooks/use_maintenances_selection";
import type { Maintenance } from "../types";
import { CategoryBadge, CategoryTile, maintenancesExportTable, StatusBadge } from "./maintenances_parts";
import { fieldLabel, maintenancesPanel } from "./maintenances_styles";

const headCell = cn(fieldLabel, "px-3 py-3 text-left whitespace-nowrap");
const checkbox = cn("size-4.5 cursor-pointer rounded accent-brand-600!", focusRing);

export type MaintenancesTableProps = {
  results: Maintenance[];
  asOf: string;
  selectedId: string | null;
  onSelect: (maintenance: Maintenance) => void;
  /** Checked rows, for the export. */
  selection: UseMaintenancesSelectionResult;
  className?: string;
};

export function MaintenancesTable({ results, asOf, selectedId, onSelect, selection, className }: MaintenancesTableProps) {
  const ids = results.map((maintenance) => maintenance.id);
  const checkedCount = selection.selected.length;
  const checkedRows = results.filter((maintenance) => selection.isSelected(maintenance.id));

  return (
    <section aria-labelledby="maintenances-table-title" className={cn(maintenancesPanel, "overflow-hidden", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-6 py-4 dark:border-white/10">
        <h2 id="maintenances-table-title" className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          {results.length} maintenance{results.length > 1 ? "s" : ""} trouvée{results.length > 1 ? "s" : ""}
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          {checkedCount > 0 ? (
            <button
              type="button"
              onClick={selection.clear}
              className={cn(
                "h-9 cursor-pointer rounded-xl px-3 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/10",
                focusRing,
              )}
            >
              Désélectionner
            </button>
          ) : null}
          <ExportActions
            count={checkedCount > 0 ? checkedCount : results.length}
            selection={checkedCount > 0}
            getTable={() => maintenancesExportTable(checkedCount > 0 ? checkedRows : results, asOf)}
          />
        </div>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center gap-1 px-6 py-12 text-center">
          <p className="font-semibold text-zinc-900 dark:text-zinc-100">Aucune maintenance ne correspond</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Modifiez la recherche ou réinitialisez les filtres.</p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto xl:block">
            <table className="w-full table-fixed border-collapse text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50/80 dark:border-white/10 dark:bg-white/5">
                <tr>
                  <th scope="col" className="w-12 py-3 pr-2 pl-6">
                    <input
                      type="checkbox"
                      aria-label="Sélectionner toutes les maintenances affichées"
                      checked={checkedCount > 0 && checkedCount === ids.length}
                      ref={(input) => {
                        if (input) input.indeterminate = checkedCount > 0 && checkedCount < ids.length;
                      }}
                      onChange={() => selection.togglePage(ids)}
                      className={checkbox}
                    />
                  </th>
                  <th scope="col" className={cn(headCell, "w-28")}>Image</th>
                  <th scope="col" className={headCell}>Description</th>
                  <th scope="col" className={cn(headCell, "w-36")}>Catégorie</th>
                  <th scope="col" className={cn(headCell, "w-36")}>Date de création</th>
                  <th scope="col" className={cn(headCell, "w-36 pr-6")}>Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-white/10">
                {results.map((maintenance) => {
                  const selected = maintenance.id === selectedId;
                  const checked = selection.isSelected(maintenance.id);
                  return (
                    <tr
                      key={maintenance.id}
                      onClick={() => onSelect(maintenance)}
                      className={cn(
                        "cursor-pointer align-middle transition-colors",
                        selected
                          ? "bg-brand-50/70 shadow-[inset_3px_0_0_var(--color-brand-500)] dark:bg-brand-900/30"
                          : checked
                            ? "bg-brand-50/40 dark:bg-brand-900/20"
                            : "hover:bg-zinc-50/70 dark:hover:bg-white/[0.03]",
                      )}
                    >
                      {/* The checkbox selects for export; the rest of the row opens the detail. */}
                      <td className="py-3 pr-2 pl-6" onClick={(event) => event.stopPropagation()}>
                        <input
                          type="checkbox"
                          aria-label={`Sélectionner la maintenance ${maintenance.reference}`}
                          checked={checked}
                          onChange={() => selection.toggle(maintenance.id)}
                          className={checkbox}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <CategoryTile category={maintenance.category} className="h-[62px] w-[84px] rounded-xl" iconClassName="size-7.5" />
                      </td>
                      <td className="px-3 py-3">
                        <button
                          type="button"
                          aria-pressed={selected}
                          onClick={(event) => {
                            event.stopPropagation();
                            onSelect(maintenance);
                          }}
                          className={cn("block rounded text-left leading-snug font-semibold text-zinc-950 hover:underline dark:text-zinc-50", focusRing)}
                        >
                          {maintenance.description}
                        </button>
                        <span className="mt-1 block truncate text-xs text-zinc-500 dark:text-zinc-400" title={maintenance.property}>
                          <span className="font-semibold text-brand-700 tabular-nums dark:text-brand-100">{maintenance.reference}</span> · {maintenance.property}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <CategoryBadge category={maintenance.category} />
                      </td>
                      <td className="px-3 py-3">
                        <span className="block font-semibold whitespace-nowrap text-zinc-900 tabular-nums dark:text-zinc-100">
                          {formatShortDate(maintenance.createdAt)}
                        </span>
                        <span
                          className={cn(
                            "block text-xs",
                            isStale(maintenance, asOf) ? "font-semibold text-orange-700 dark:text-orange-300" : "text-zinc-500 dark:text-zinc-400",
                          )}
                        >
                          {agoLabel(maintenance, asOf)}
                        </span>
                      </td>
                      <td className="py-3 pr-6 pl-3">
                        <StatusBadge maintenance={maintenance} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <ul className="flex flex-col gap-1 p-3 xl:hidden">
            {results.map((maintenance) => {
              const selected = maintenance.id === selectedId;
              return (
                <li key={maintenance.id} className="flex items-center gap-1 pl-2">
                  <input
                    type="checkbox"
                    aria-label={`Sélectionner la maintenance ${maintenance.reference}`}
                    checked={selection.isSelected(maintenance.id)}
                    onChange={() => selection.toggle(maintenance.id)}
                    className={checkbox}
                  />
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onSelect(maintenance)}
                    className={cn(
                      "flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-2xl p-3 text-left",
                      focusRing,
                      selected ? "bg-brand-50/70 ring-1 ring-brand-200 dark:bg-brand-900/30 dark:ring-brand-700" : "hover:bg-zinc-50 dark:hover:bg-white/5",
                    )}
                  >
                    <CategoryTile category={maintenance.category} className="size-12 rounded-xl" iconClassName="size-6" />
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 leading-snug font-semibold text-zinc-950 dark:text-zinc-50">{maintenance.description}</span>
                      <span className="mt-0.5 block truncate text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="font-semibold text-brand-700 dark:text-brand-100">{maintenance.reference}</span> · {maintenance.property}
                      </span>
                      <span className="mt-1.5 flex min-w-0 items-center gap-2">
                        <StatusBadge maintenance={maintenance} />
                        <span className="truncate text-xs text-zinc-500 tabular-nums dark:text-zinc-400">{agoLabel(maintenance, asOf)}</span>
                      </span>
                    </span>
                    <Icon name="chevronRight" className="size-4 shrink-0 text-zinc-400" />
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}
