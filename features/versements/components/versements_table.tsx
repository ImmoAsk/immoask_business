"use client";

import { ExportActions } from "@/components/ui/export_actions";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/utils/dates";
import { agoLabel, METHOD_LABELS } from "../hooks/versements_labels";
import type { UseVersementsSelectionResult } from "../hooks/use_versements_selection";
import type { Versement } from "../types";
import { amountText, Attachment, MethodLabel, TypeBadge, versementsExportTable } from "./versements_parts";
import { fieldLabel, versementsPanel } from "./versements_styles";

const headCell = cn(fieldLabel, "px-3 py-3 text-left whitespace-nowrap");
const checkbox = cn("size-4.5 cursor-pointer rounded accent-brand-600!", focusRing);
/** Shown in the detail panel, so hidden when the panel sits beside the table. */
const besidePanel = "min-[100rem]:hidden";
/** Also needs the extra width of 2xl when the panel is below. */
const attachmentColumn = "hidden 2xl:table-cell min-[100rem]:hidden";

export type VersementsTableProps = {
  results: Versement[];
  asOf: string;
  selectedId: string | null;
  onSelect: (versement: Versement) => void;
  /** Checked rows, for the export. */
  selection: UseVersementsSelectionResult;
  className?: string;
};

export function VersementsTable({ results, asOf, selectedId, onSelect, selection, className }: VersementsTableProps) {
  const ids = results.map((versement) => versement.id);
  const checkedCount = selection.selected.length;
  const checkedRows = results.filter((versement) => selection.isSelected(versement.id));

  return (
    <section aria-labelledby="versements-table-title" className={cn(versementsPanel, "overflow-hidden", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-6 py-4 dark:border-white/10">
        <h2 id="versements-table-title" className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          {results.length} versement{results.length > 1 ? "s" : ""} trouvé{results.length > 1 ? "s" : ""}
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
            getTable={() => versementsExportTable(checkedCount > 0 ? checkedRows : results)}
          />
        </div>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center gap-1 px-6 py-12 text-center">
          <p className="font-semibold text-zinc-900 dark:text-zinc-100">Aucun versement ne correspond</p>
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
                      aria-label="Sélectionner tous les versements affichés"
                      checked={checkedCount > 0 && checkedCount === ids.length}
                      ref={(input) => {
                        if (input) input.indeterminate = checkedCount > 0 && checkedCount < ids.length;
                      }}
                      onChange={() => selection.togglePage(ids)}
                      className={checkbox}
                    />
                  </th>
                  <th scope="col" className={headCell}>Contrat de gestion</th>
                  <th scope="col" className={cn(headCell, "w-28")}>Type</th>
                  <th scope="col" className={cn(headCell, "w-40")}>Montant versé</th>
                  <th scope="col" className={cn(headCell, "w-44", besidePanel)}>Moyen</th>
                  <th scope="col" className={cn(headCell, "w-32")}>Date du dépôt</th>
                  <th scope="col" className={cn(headCell, "w-60 pr-6", attachmentColumn)}>Pièce jointe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-white/10">
                {results.map((versement) => {
                  const selected = versement.id === selectedId;
                  const checked = selection.isSelected(versement.id);
                  return (
                    <tr
                      key={versement.id}
                      onClick={() => onSelect(versement)}
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
                      <td className="py-3.5 pr-2 pl-6" onClick={(event) => event.stopPropagation()}>
                        <input
                          type="checkbox"
                          aria-label={`Sélectionner le versement ${versement.reference}`}
                          checked={checked}
                          onChange={() => selection.toggle(versement.id)}
                          className={checkbox}
                        />
                      </td>
                      <td className="px-3 py-3.5">
                        <button
                          type="button"
                          aria-pressed={selected}
                          aria-label={`Voir le versement ${versement.reference}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            onSelect(versement);
                          }}
                          className={cn("rounded font-bold whitespace-nowrap text-brand-700 tabular-nums hover:underline dark:text-brand-100", focusRing)}
                        >
                          {versement.management.reference}
                        </button>
                        <span className="mt-0.5 block truncate text-xs text-zinc-500 dark:text-zinc-400" title={versement.management.property}>
                          {versement.management.owner} · {versement.management.property}
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        <TypeBadge type={versement.type} />
                      </td>
                      <td className="px-3 py-3.5 text-[15px] font-bold whitespace-nowrap text-zinc-950 tabular-nums dark:text-zinc-50">{amountText(versement)}</td>
                      <td className={cn("px-3 py-3.5", besidePanel)}>
                        <MethodLabel method={versement.method} />
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="block font-semibold whitespace-nowrap text-zinc-900 tabular-nums dark:text-zinc-100">{formatShortDate(versement.date)}</span>
                        <span className="block text-xs text-zinc-500 dark:text-zinc-400">{agoLabel(versement.date, asOf)}</span>
                      </td>
                      <td className={cn("py-3.5 pr-6 pl-3", attachmentColumn)}>
                        <Attachment versement={versement} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <ul className="flex flex-col gap-1 p-3 xl:hidden">
            {results.map((versement) => {
              const selected = versement.id === selectedId;
              return (
                <li key={versement.id} className="flex items-center gap-1 pl-2">
                  <input
                    type="checkbox"
                    aria-label={`Sélectionner le versement ${versement.reference}`}
                    checked={selection.isSelected(versement.id)}
                    onChange={() => selection.toggle(versement.id)}
                    className={checkbox}
                  />
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onSelect(versement)}
                    className={cn(
                      "flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-2xl p-3 text-left",
                      focusRing,
                      selected ? "bg-brand-50/70 ring-1 ring-brand-200 dark:bg-brand-900/30 dark:ring-brand-700" : "hover:bg-zinc-50 dark:hover:bg-white/5",
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold text-zinc-950 tabular-nums dark:text-zinc-50">{amountText(versement)}</span>
                      <span className="mt-0.5 block truncate text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="font-semibold text-brand-700 dark:text-brand-100">{versement.management.reference}</span> · {versement.management.owner}
                      </span>
                      <span className="mt-1.5 flex min-w-0 items-center gap-2">
                        <TypeBadge type={versement.type} />
                        <span className="truncate text-xs text-zinc-500 tabular-nums dark:text-zinc-400">
                          {METHOD_LABELS[versement.method]} · {formatShortDate(versement.date)}
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
