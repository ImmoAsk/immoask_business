"use client";

import { ExportActions } from "@/components/ui/export_actions";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/utils/dates";
import { agoLabel } from "../hooks/cautions_balance";
import type { UseCautionsSelectionResult } from "../hooks/use_cautions_selection";
import type { Caution } from "../types";
import { cautionsExportTable, fcfa, ModeBadge, StatusBadge, VaultBar } from "./cautions_parts";
import { cautionsPanel, fieldLabel } from "./cautions_styles";

const headCell = cn(fieldLabel, "px-3 py-3 text-left whitespace-nowrap");
const checkbox = cn("size-4.5 cursor-pointer rounded accent-brand-600!", focusRing);
/** Shown in the detail panel, so hidden when the panel sits beside the table. */
const besidePanel = "min-[100rem]:hidden";

export type CautionsTableProps = {
  results: Caution[];
  asOf: string;
  selectedId: string | null;
  onSelect: (caution: Caution) => void;
  /** Checked rows, for the export. */
  selection: UseCautionsSelectionResult;
  className?: string;
};

export function CautionsTable({ results, asOf, selectedId, onSelect, selection, className }: CautionsTableProps) {
  const ids = results.map((caution) => caution.id);
  const checkedCount = selection.selected.length;
  const checkedRows = results.filter((caution) => selection.isSelected(caution.id));

  return (
    <section aria-labelledby="cautions-table-title" className={cn(cautionsPanel, "overflow-hidden", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-6 py-4 dark:border-white/10">
        <h2 id="cautions-table-title" className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          {results.length} caution{results.length > 1 ? "s" : ""} trouvée{results.length > 1 ? "s" : ""}
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
            getTable={() => cautionsExportTable(checkedCount > 0 ? checkedRows : results)}
          />
        </div>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center gap-1 px-6 py-12 text-center">
          <p className="font-semibold text-zinc-900 dark:text-zinc-100">Aucune caution ne correspond</p>
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
                      aria-label="Sélectionner toutes les cautions affichées"
                      checked={checkedCount > 0 && checkedCount === ids.length}
                      ref={(input) => {
                        if (input) input.indeterminate = checkedCount > 0 && checkedCount < ids.length;
                      }}
                      onChange={() => selection.togglePage(ids)}
                      className={checkbox}
                    />
                  </th>
                  <th scope="col" className={cn(headCell, "w-36")}>Contrat de location</th>
                  <th scope="col" className={headCell}>Locataire · Propriété</th>
                  <th scope="col" className={cn(headCell, "w-40")}>Caution</th>
                  <th scope="col" className={cn(headCell, "w-48")}>Coffre</th>
                  <th scope="col" className={cn(headCell, "w-32", besidePanel)}>Date de dépôt</th>
                  <th scope="col" className={cn(headCell, "w-28 pr-6")}>Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-white/10">
                {results.map((caution) => {
                  const selected = caution.id === selectedId;
                  const checked = selection.isSelected(caution.id);
                  return (
                    <tr
                      key={caution.id}
                      onClick={() => onSelect(caution)}
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
                          aria-label={`Sélectionner la caution ${caution.reference}`}
                          checked={checked}
                          onChange={() => selection.toggle(caution.id)}
                          className={checkbox}
                        />
                      </td>
                      <td className="px-3 py-3.5">
                        <button
                          type="button"
                          aria-pressed={selected}
                          aria-label={`Voir la caution ${caution.reference}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            onSelect(caution);
                          }}
                          className={cn("rounded font-bold whitespace-nowrap text-brand-700 tabular-nums hover:underline dark:text-brand-100", focusRing)}
                        >
                          {caution.agreement.reference}
                        </button>
                        <span className="block text-xs text-zinc-500 tabular-nums dark:text-zinc-400">{caution.reference}</span>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="block truncate font-bold text-zinc-950 dark:text-zinc-50">{caution.agreement.tenant}</span>
                        <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400" title={caution.agreement.property}>
                          {caution.agreement.property}
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="block text-[15px] font-bold whitespace-nowrap text-zinc-950 tabular-nums dark:text-zinc-50">{fcfa(caution.amount)}</span>
                        <ModeBadge caution={caution} className="mt-1" />
                      </td>
                      <td className="px-3 py-3.5">
                        <VaultBar caution={caution} />
                      </td>
                      <td className={cn("px-3 py-3.5", besidePanel)}>
                        <span className="block font-semibold whitespace-nowrap text-zinc-900 tabular-nums dark:text-zinc-100">{formatShortDate(caution.depositedAt)}</span>
                        <span className="block text-xs text-zinc-500 dark:text-zinc-400">{agoLabel(caution, asOf)}</span>
                      </td>
                      <td className="py-3.5 pr-6 pl-3">
                        <StatusBadge caution={caution} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <ul className="flex flex-col gap-1 p-3 xl:hidden">
            {results.map((caution) => {
              const selected = caution.id === selectedId;
              return (
                <li key={caution.id} className="flex items-center gap-1 pl-2">
                  <input
                    type="checkbox"
                    aria-label={`Sélectionner la caution ${caution.reference}`}
                    checked={selection.isSelected(caution.id)}
                    onChange={() => selection.toggle(caution.id)}
                    className={checkbox}
                  />
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onSelect(caution)}
                    className={cn(
                      "flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-2xl p-3 text-left",
                      focusRing,
                      selected ? "bg-brand-50/70 ring-1 ring-brand-200 dark:bg-brand-900/30 dark:ring-brand-700" : "hover:bg-zinc-50 dark:hover:bg-white/5",
                    )}
                  >
                    <span className="flex min-w-0 flex-1 flex-col gap-2">
                      <span className="flex min-w-0 items-start justify-between gap-2">
                        <span className="min-w-0">
                          <span className="block truncate font-semibold text-zinc-950 dark:text-zinc-50">{caution.agreement.tenant}</span>
                          <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">
                            <span className="font-semibold text-brand-700 dark:text-brand-100">{caution.agreement.reference}</span> · {caution.agreement.property}
                          </span>
                        </span>
                        <StatusBadge caution={caution} />
                      </span>
                      <VaultBar caution={caution} />
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
