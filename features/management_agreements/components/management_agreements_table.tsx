"use client";

import { ExportActions } from "@/components/ui/export_actions";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/utils/dates";
import type { ExportTable } from "@/lib/utils/export";
import { monthlyCommission } from "../hooks/management_agreements_money";
import type { UseManagementAgreementsSelectionResult } from "../hooks/use_management_agreements_selection";
import type { ManagementAgreement } from "../types";
import { OwnerAvatar, ownerKindLabel, remunerationDetail, remunerationShort, remunerationType, StatusBadge } from "./management_agreements_parts";
import { agreementStatuses, fieldLabel, managementPanel, terminationReasons } from "./management_agreements_styles";

const headCell = cn(fieldLabel, "px-3 py-3 text-left whitespace-nowrap");
const checkbox = cn("size-4.5 cursor-pointer rounded accent-brand-600!", focusRing);

export type ManagementAgreementsTableProps = {
  results: ManagementAgreement[];
  selectedId: string | null;
  onSelect: (agreement: ManagementAgreement) => void;
  /** Checked rows, for the export. */
  selection: UseManagementAgreementsSelectionResult;
  className?: string;
};

export function ManagementAgreementsTable({ results, selectedId, onSelect, selection, className }: ManagementAgreementsTableProps) {
  const ids = results.map((agreement) => agreement.id);
  const checkedCount = selection.selected.length;
  const checkedRows = results.filter((agreement) => selection.isSelected(agreement.id));

  return (
    <section aria-labelledby="management-table-title" className={cn(managementPanel, "overflow-hidden", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-6 py-4 dark:border-white/10">
        <h2 id="management-table-title" className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          {results.length} contrat{results.length > 1 ? "s" : ""} trouvé{results.length > 1 ? "s" : ""}
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
            getTable={() => managementAgreementsExportTable(checkedCount > 0 ? checkedRows : results)}
          />
        </div>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center gap-1 px-6 py-12 text-center">
          <p className="font-semibold text-zinc-900 dark:text-zinc-100">Aucun contrat ne correspond</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Modifiez la recherche ou réinitialisez les filtres.</p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[820px] table-fixed border-collapse text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50/80 dark:border-white/10 dark:bg-white/5">
                <tr>
                  <th scope="col" className="w-12 py-3 pr-2 pl-6">
                    <input
                      type="checkbox"
                      aria-label="Sélectionner tous les contrats affichés"
                      checked={checkedCount > 0 && checkedCount === ids.length}
                      ref={(input) => {
                        if (input) input.indeterminate = checkedCount > 0 && checkedCount < ids.length;
                      }}
                      onChange={() => selection.togglePage(ids)}
                      className={checkbox}
                    />
                  </th>
                  <th scope="col" className={cn(headCell, "w-[16%]")}>N° contrat</th>
                  <th scope="col" className={cn(headCell, "w-[24%]")}>Propriétaire</th>
                  <th scope="col" className={cn(headCell, "w-[18%]")}>Gestionnaire</th>
                  <th scope="col" className={cn(headCell, "w-[18%]")}>Rémunération</th>
                  <th scope="col" className={cn(headCell, "w-[8%]")}>Biens</th>
                  <th scope="col" className={cn(headCell, "w-[14%] pr-6")}>Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-white/10">
                {results.map((agreement) => {
                  const selected = agreement.id === selectedId;
                  const checked = selection.isSelected(agreement.id);
                  return (
                    <tr
                      key={agreement.id}
                      onClick={() => onSelect(agreement)}
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
                          aria-label={`Sélectionner le contrat ${agreement.reference}`}
                          checked={checked}
                          onChange={() => selection.toggle(agreement.id)}
                          className={checkbox}
                        />
                      </td>
                      <td className="py-3.5 pr-3 pl-3">
                        <button
                          type="button"
                          aria-pressed={selected}
                          aria-label={`Voir le contrat ${agreement.reference}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            onSelect(agreement);
                          }}
                          className={cn("rounded font-bold whitespace-nowrap text-brand-700 tabular-nums hover:underline dark:text-brand-100", focusRing)}
                        >
                          {agreement.reference}
                        </button>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="flex min-w-0 items-center gap-3">
                          <OwnerAvatar agreement={agreement} />
                          <span className="min-w-0">
                            <span className="block truncate font-semibold text-zinc-950 dark:text-zinc-50" title={agreement.owner.name}>
                              {agreement.owner.name}
                            </span>
                            <span className="block text-xs text-zinc-500 dark:text-zinc-400">{ownerKindLabel(agreement)}</span>
                          </span>
                        </span>
                      </td>
                      <td className="truncate px-3 py-3.5 font-medium text-zinc-800 dark:text-zinc-200">{agreement.manager}</td>
                      <td className="px-3 py-3.5">
                        <span className="block font-semibold whitespace-nowrap text-zinc-900 tabular-nums dark:text-zinc-100">
                          {remunerationShort(agreement.remuneration)}
                        </span>
                        <span className="block text-xs text-zinc-500 dark:text-zinc-400">{remunerationType(agreement.remuneration)}</span>
                      </td>
                      <td className="px-3 py-3.5 font-bold text-zinc-950 tabular-nums dark:text-zinc-50">{agreement.biensCount}</td>
                      <td className="py-3.5 pr-6 pl-3">
                        <StatusBadge agreement={agreement} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <ul className="flex flex-col gap-1 p-3 md:hidden">
            {results.map((agreement) => {
              const selected = agreement.id === selectedId;
              return (
                <li key={agreement.id} className="flex items-center gap-1 pl-2">
                  <input
                    type="checkbox"
                    aria-label={`Sélectionner le contrat ${agreement.reference}`}
                    checked={selection.isSelected(agreement.id)}
                    onChange={() => selection.toggle(agreement.id)}
                    className={checkbox}
                  />
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onSelect(agreement)}
                    className={cn(
                      "flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-2xl p-3 text-left",
                      focusRing,
                      selected ? "bg-brand-50/70 ring-1 ring-brand-200 dark:bg-brand-900/30 dark:ring-brand-700" : "hover:bg-zinc-50 dark:hover:bg-white/5",
                    )}
                  >
                    <OwnerAvatar agreement={agreement} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-zinc-950 dark:text-zinc-50">{agreement.owner.name}</span>
                      <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="font-semibold text-brand-700 dark:text-brand-100">{agreement.reference}</span> ·{" "}
                        {remunerationShort(agreement.remuneration)} · {agreement.biensCount} bien{agreement.biensCount > 1 ? "s" : ""}
                      </span>
                    </span>
                    <StatusBadge agreement={agreement} />
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

/** Rows for the CSV / PDF export. */
export function managementAgreementsExportTable(agreements: ManagementAgreement[]): ExportTable {
  return {
    title: "Contrats de gestion ImmoAsk",
    header: [
      "N° contrat",
      "Propriétaire",
      "Type",
      "Gestionnaire",
      "Mode de rémunération",
      "Taux / montant",
      "Biens",
      "Loyers (FCFA/mois)",
      "Commission estimée (FCFA/mois)",
      "Statut",
      "Signature",
      "Début",
      "Résiliation",
    ],
    rows: agreements.map((agreement) => {
      const detail = remunerationDetail(agreement.remuneration);
      return [
        agreement.reference,
        agreement.owner.name,
        ownerKindLabel(agreement),
        agreement.manager,
        detail.mode,
        detail.value,
        agreement.biensCount,
        agreement.monthlyRents,
        monthlyCommission(agreement),
        agreementStatuses[agreement.status].label,
        formatShortDate(agreement.signedAt),
        formatShortDate(agreement.startDate),
        agreement.termination
          ? `${formatShortDate(agreement.termination.date)} · ${terminationReasons[agreement.termination.reason]}`
          : "",
      ];
    }),
  };
}
