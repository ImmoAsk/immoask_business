"use client";

import { ExportActions } from "@/components/ui/export_actions";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/utils/dates";
import { agoLabel, TYPE_LABELS } from "../hooks/etat_lieux_items";
import type { UseEtatLieuxSelectionResult } from "../hooks/use_etat_lieux_selection";
import type { InventoryLine } from "../types";
import { ConditionBadge, costText, etatLieuxExportTable, KindTile, photosText, TypeBadge } from "./etat_lieux_parts";
import { etatLieuxPanel, fieldLabel } from "./etat_lieux_styles";

const headCell = cn(fieldLabel, "px-3 py-3 text-left whitespace-nowrap");
const checkbox = cn("size-4.5 cursor-pointer rounded accent-brand-600!", focusRing);
/** Shown in the detail panel, so hidden when the panel sits beside the table. */
const besidePanel = "min-[100rem]:hidden";

export type EtatLieuxTableProps = {
  results: InventoryLine[];
  asOf: string;
  selectedId: string | null;
  onSelect: (line: InventoryLine) => void;
  /** Checked rows, for the export. */
  selection: UseEtatLieuxSelectionResult;
  className?: string;
};

export function EtatLieuxTable({ results, asOf, selectedId, onSelect, selection, className }: EtatLieuxTableProps) {
  const ids = results.map((line) => line.id);
  const checkedCount = selection.selected.length;
  const checkedRows = results.filter((line) => selection.isSelected(line.id));

  return (
    <section aria-labelledby="etat-lieux-table-title" className={cn(etatLieuxPanel, "overflow-hidden", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-6 py-4 dark:border-white/10">
        <h2 id="etat-lieux-table-title" className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          {results.length} élément{results.length > 1 ? "s" : ""} inventorié{results.length > 1 ? "s" : ""}
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
            getTable={() => etatLieuxExportTable(checkedCount > 0 ? checkedRows : results)}
          />
        </div>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center gap-1 px-6 py-12 text-center">
          <p className="font-semibold text-zinc-900 dark:text-zinc-100">Aucun élément ne correspond</p>
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
                      aria-label="Sélectionner tous les éléments affichés"
                      checked={checkedCount > 0 && checkedCount === ids.length}
                      ref={(input) => {
                        if (input) input.indeterminate = checkedCount > 0 && checkedCount < ids.length;
                      }}
                      onChange={() => selection.togglePage(ids)}
                      className={checkbox}
                    />
                  </th>
                  <th scope="col" className={cn(headCell, "w-28")}>Photos</th>
                  <th scope="col" className={headCell}>Élément</th>
                  <th scope="col" className={cn(headCell, "w-28")}>Type</th>
                  <th scope="col" className={cn(headCell, besidePanel)}>Propriété · Locataire</th>
                  <th scope="col" className={cn(headCell, "w-32")}>État</th>
                  <th scope="col" className={cn(headCell, "w-32")}>Coût</th>
                  <th scope="col" className={cn(headCell, "w-32 pr-6")}>Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-white/10">
                {results.map((line) => {
                  const selected = line.id === selectedId;
                  const checked = selection.isSelected(line.id);
                  return (
                    <tr
                      key={line.id}
                      onClick={() => onSelect(line)}
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
                          aria-label={`Sélectionner ${line.element} (${line.inventory.reference})`}
                          checked={checked}
                          onChange={() => selection.toggle(line.id)}
                          className={checkbox}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <KindTile kind={line.kind} className="h-[62px] w-[84px] rounded-xl" iconClassName="size-7">
                          <span className="absolute right-1 bottom-1 rounded-md bg-brand-950/55 px-1.5 py-px text-[10.5px] font-bold">{photosText(line.photos)}</span>
                        </KindTile>
                      </td>
                      <td className="px-3 py-3">
                        <button
                          type="button"
                          aria-pressed={selected}
                          onClick={(event) => {
                            event.stopPropagation();
                            onSelect(line);
                          }}
                          className={cn("block rounded text-left leading-snug font-bold text-zinc-950 hover:underline dark:text-zinc-50", focusRing)}
                        >
                          {line.element}
                        </button>
                        <span className="mt-1 block truncate text-xs text-zinc-500 dark:text-zinc-400">
                          {line.room} · <span className="font-semibold text-brand-700 tabular-nums dark:text-brand-100">{line.inventory.reference}</span>
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <TypeBadge type={line.inventory.type} />
                      </td>
                      <td className={cn("px-3 py-3", besidePanel)}>
                        <span className="block truncate font-semibold text-zinc-900 dark:text-zinc-100" title={line.inventory.property}>
                          {line.inventory.property}
                        </span>
                        <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">{line.inventory.tenant}</span>
                      </td>
                      <td className="px-3 py-3">
                        <ConditionBadge condition={line.condition} />
                      </td>
                      <td
                        className={cn(
                          "px-3 py-3 font-bold whitespace-nowrap tabular-nums",
                          line.cost === null ? "text-zinc-400 dark:text-zinc-500" : "text-zinc-950 dark:text-zinc-50",
                        )}
                      >
                        {costText(line.cost)}
                      </td>
                      <td className="py-3 pr-6 pl-3">
                        <span className="block font-semibold whitespace-nowrap text-zinc-900 tabular-nums dark:text-zinc-100">{formatShortDate(line.inventory.date)}</span>
                        <span className="block text-xs text-zinc-500 dark:text-zinc-400">{agoLabel(line.inventory.date, asOf)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <ul className="flex flex-col gap-1 p-3 xl:hidden">
            {results.map((line) => {
              const selected = line.id === selectedId;
              return (
                <li key={line.id} className="flex items-center gap-1 pl-2">
                  <input
                    type="checkbox"
                    aria-label={`Sélectionner ${line.element} (${line.inventory.reference})`}
                    checked={selection.isSelected(line.id)}
                    onChange={() => selection.toggle(line.id)}
                    className={checkbox}
                  />
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onSelect(line)}
                    className={cn(
                      "flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-2xl p-3 text-left",
                      focusRing,
                      selected ? "bg-brand-50/70 ring-1 ring-brand-200 dark:bg-brand-900/30 dark:ring-brand-700" : "hover:bg-zinc-50 dark:hover:bg-white/5",
                    )}
                  >
                    <KindTile kind={line.kind} className="size-12 rounded-xl" iconClassName="size-6" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-zinc-950 dark:text-zinc-50">{line.element}</span>
                      <span className="mt-0.5 block truncate text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="font-semibold text-brand-700 dark:text-brand-100">{line.inventory.reference}</span> · {line.inventory.property}
                      </span>
                      <span className="mt-1.5 flex min-w-0 items-center gap-2">
                        <ConditionBadge condition={line.condition} />
                        <span className="truncate text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                          {TYPE_LABELS[line.inventory.type]}
                        </span>
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
