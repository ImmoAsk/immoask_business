"use client";

import { ExportActions } from "@/components/ui/export_actions";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/utils/dates";
import type { ExportTable } from "@/lib/utils/export";
import { agreementStatus, depositAmount, stayNights } from "../hooks/rent_agreements_status";
import type { UseRentAgreementsSelectionResult } from "../hooks/use_rent_agreements_selection";
import type { RentAgreement } from "../types";
import { amountText, depositText, StatusBadge, TenantAvatar, TypeBadge } from "./rent_agreements_parts";
import { agreementStatuses, agreementTypes, fieldLabel, rentPanel, terminationReasons } from "./rent_agreements_styles";

const headCell = cn(fieldLabel, "px-3 py-3 text-left whitespace-nowrap");
const checkbox = cn("size-4.5 cursor-pointer rounded accent-brand-600!", focusRing);
/** Columns the detail panel already shows, hidden when it sits beside the table. */
const besidePanel = "min-[100rem]:hidden";

export type RentAgreementsTableProps = {
  results: RentAgreement[];
  asOf: string;
  selectedId: string | null;
  onSelect: (agreement: RentAgreement) => void;
  /** Checked rows, for the export. */
  selection: UseRentAgreementsSelectionResult;
  className?: string;
};

export function RentAgreementsTable({ results, asOf, selectedId, onSelect, selection, className }: RentAgreementsTableProps) {
  const ids = results.map((agreement) => agreement.id);
  const checkedCount = selection.selected.length;
  const checkedRows = results.filter((agreement) => selection.isSelected(agreement.id));

  return (
    <section aria-labelledby="rent-table-title" className={cn(rentPanel, "overflow-hidden", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-6 py-4 dark:border-white/10">
        <h2 id="rent-table-title" className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          {results.length} location{results.length > 1 ? "s" : ""} trouvée{results.length > 1 ? "s" : ""}
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
            getTable={() => rentAgreementsExportTable(checkedCount > 0 ? checkedRows : results, asOf)}
          />
        </div>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center gap-1 px-6 py-12 text-center">
          <p className="font-semibold text-zinc-900 dark:text-zinc-100">Aucune location ne correspond</p>
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
                      aria-label="Sélectionner toutes les locations affichées"
                      checked={checkedCount > 0 && checkedCount === ids.length}
                      ref={(input) => {
                        if (input) input.indeterminate = checkedCount > 0 && checkedCount < ids.length;
                      }}
                      onChange={() => selection.togglePage(ids)}
                      className={checkbox}
                    />
                  </th>
                  <th scope="col" className={cn(headCell, "w-32")}>N° location</th>
                  <th scope="col" className={headCell}>Propriété</th>
                  <th scope="col" className={headCell}>Locataire</th>
                  <th scope="col" className={cn(headCell, "w-28")}>Type</th>
                  <th scope="col" className={cn(headCell, "w-32")}>Montant final</th>
                  <th scope="col" className={cn(headCell, "w-28", besidePanel)}>Début</th>
                  <th scope="col" className={cn(headCell, "w-36", besidePanel)}>Caution</th>
                  <th scope="col" className={cn(headCell, "w-28 pr-6")}>Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-white/10">
                {results.map((agreement) => {
                  const selected = agreement.id === selectedId;
                  const checked = selection.isSelected(agreement.id);
                  const amount = amountText(agreement);
                  const deposit = depositText(agreement);
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
                          aria-label={`Sélectionner la location ${agreement.reference}`}
                          checked={checked}
                          onChange={() => selection.toggle(agreement.id)}
                          className={checkbox}
                        />
                      </td>
                      <td className="px-3 py-3.5">
                        <button
                          type="button"
                          aria-pressed={selected}
                          aria-label={`Voir la location ${agreement.reference}`}
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
                        <span className="block truncate font-semibold text-zinc-950 dark:text-zinc-50" title={agreement.property}>
                          {agreement.property}
                        </span>
                        <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400" title={agreement.management.label}>
                          {agreement.management.label}
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="flex min-w-0 items-center gap-2.5">
                          <TenantAvatar name={agreement.tenant} />
                          <span className="truncate font-semibold text-zinc-900 dark:text-zinc-100" title={agreement.tenant}>
                            {agreement.tenant}
                          </span>
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        <TypeBadge agreement={agreement} />
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="block font-bold whitespace-nowrap text-zinc-950 tabular-nums dark:text-zinc-50">{amount.value}</span>
                        <span className="block text-xs whitespace-nowrap text-zinc-500 dark:text-zinc-400">{amount.sub}</span>
                      </td>
                      <td className={cn("px-3 py-3.5 whitespace-nowrap text-zinc-800 tabular-nums dark:text-zinc-200", besidePanel)}>
                        {formatShortDate(agreement.startDate)}
                      </td>
                      <td className={cn("px-3 py-3.5", besidePanel)}>
                        <span className="block font-semibold whitespace-nowrap text-zinc-900 dark:text-zinc-100">{deposit.label}</span>
                        <span className="block text-xs whitespace-nowrap text-zinc-500 tabular-nums dark:text-zinc-400">{deposit.value}</span>
                      </td>
                      <td className="py-3.5 pr-6 pl-3">
                        <StatusBadge agreement={agreement} asOf={asOf} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <ul className="flex flex-col gap-1 p-3 xl:hidden">
            {results.map((agreement) => {
              const selected = agreement.id === selectedId;
              return (
                <li key={agreement.id} className="flex items-center gap-1 pl-2">
                  <input
                    type="checkbox"
                    aria-label={`Sélectionner la location ${agreement.reference}`}
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
                    <TenantAvatar name={agreement.tenant} className="size-9" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-zinc-950 dark:text-zinc-50">{agreement.tenant}</span>
                      <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="font-semibold text-brand-700 dark:text-brand-100">{agreement.reference}</span> · {agreement.property}
                      </span>
                      <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">
                        {agreementTypes[agreement.type].label} · {amountText(agreement).value} {amountText(agreement).sub}
                      </span>
                    </span>
                    <StatusBadge agreement={agreement} asOf={asOf} />
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
export function rentAgreementsExportTable(agreements: RentAgreement[], asOf: string): ExportTable {
  return {
    title: "Contrats de location ImmoAsk",
    header: [
      "N° location",
      "Contrat de gestion",
      "Propriétaire",
      "Propriété",
      "Locataire",
      "Type",
      "Montant final (FCFA)",
      "Période",
      "Début",
      "Fin",
      "Caution",
      "Caution (FCFA)",
      "Statut",
      "Résiliation",
    ],
    rows: agreements.map((agreement) => [
      agreement.reference,
      agreement.management.label,
      agreement.management.owner,
      agreement.property,
      agreement.tenant,
      agreementTypes[agreement.type].label,
      agreement.amount,
      agreement.type === "sejour" ? `Séjour de ${stayNights(agreement)} nuits` : "Mensuel",
      formatShortDate(agreement.startDate),
      agreement.endDate ? formatShortDate(agreement.endDate) : "",
      depositText(agreement).label,
      depositAmount(agreement),
      agreementStatuses[agreementStatus(agreement, asOf)].label,
      agreement.termination ? `${formatShortDate(agreement.termination.date)} · ${terminationReasons[agreement.termination.reason]}` : "",
    ]),
  };
}
