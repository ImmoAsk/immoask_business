"use client";

import { ExportActions } from "@/components/ui/export_actions";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import type { ExportTable } from "@/lib/utils/export";
import { lotCount, netPayout } from "../hooks/proprietaires_money";
import { isMandateEndingSoon } from "../hooks/proprietaires_dates";
import type { UseProprietairesSelectionResult } from "../hooks/use_proprietaires_selection";
import type { Proprietaire } from "../types";
import { ProprietairesCard } from "./proprietaires_card";
import type { ProprietairesPaginationProps } from "./proprietaires_pagination";
import { ProprietairesPagination } from "./proprietaires_pagination";
import {
  formatPhone,
  formatTransferDate,
  LastTransferCell,
  PortfolioCell,
  ProprietairesIdentity,
  ReversementBadge,
  RevenueCell,
} from "./proprietaires_parts";
import type { ProprietaireRowAction } from "./proprietaires_row_menu";
import { ProprietairesRowMenu } from "./proprietaires_row_menu";
import { mandateTypes, profileLabels, proprietairesPanel, reversementStatuses } from "./proprietaires_styles";

const checkbox = cn("size-4.5 cursor-pointer rounded accent-brand-600!", focusRing);
const headCell =
  "px-3 py-4 text-left text-xs font-semibold tracking-wider whitespace-nowrap text-zinc-500 uppercase dark:text-zinc-400";
const iconButton = cn(
  "grid size-9 cursor-pointer place-items-center rounded-full hover:bg-zinc-100 dark:hover:bg-white/10",
  focusRing,
);

export type ProprietairesTableProps = {
  /** All results (for export), and the rows of the current page. */
  results: Proprietaire[];
  pageItems: Proprietaire[];
  asOf: string;
  selection: UseProprietairesSelectionResult;
  pagination: ProprietairesPaginationProps;
  onAction?: (action: ProprietaireRowAction, proprietaire: Proprietaire) => void;
  className?: string;
};

export function ProprietairesTable({
  results,
  pageItems,
  asOf,
  selection,
  pagination,
  onAction,
  className,
}: ProprietairesTableProps) {
  const pageIds = pageItems.map((proprietaire) => proprietaire.id);
  const checkedOnPage = pageIds.filter(selection.isSelected).length;
  const selectedCount = selection.selected.length;

  return (
    <section aria-labelledby="proprietaires-table-title" className={cn(proprietairesPanel, "overflow-hidden", className)}>
      <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-6 py-3 dark:border-white/10">
        <h2 id="proprietaires-table-title" className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          {results.length} propriétaire{results.length > 1 ? "s" : ""} trouvé{results.length > 1 ? "s" : ""}
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          {selectedCount > 0 ? (
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
            count={selectedCount > 0 ? selectedCount : results.length}
            selection={selectedCount > 0}
            getTable={() =>
              proprietairesExportTable(
                selectedCount > 0 ? results.filter((proprietaire) => selection.isSelected(proprietaire.id)) : results,
                asOf,
              )
            }
          />
        </div>
      </div>

      {results.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1000px] table-fixed border-collapse text-sm">
              <thead className="bg-zinc-50/80 dark:bg-white/5">
                <tr>
                  <th scope="col" className="w-12 py-4 pr-2 pl-6">
                    <input
                      type="checkbox"
                      aria-label="Sélectionner les propriétaires de la page"
                      checked={checkedOnPage > 0 && checkedOnPage === pageIds.length}
                      ref={(input) => {
                        if (input) input.indeterminate = checkedOnPage > 0 && checkedOnPage < pageIds.length;
                      }}
                      onChange={() => selection.togglePage(pageIds)}
                      className={checkbox}
                    />
                  </th>
                  <th scope="col" className={cn(headCell, "w-[23%]")}>Propriétaire</th>
                  <th scope="col" className={cn(headCell, "w-[24%]")}>Portefeuille</th>
                  <th scope="col" className={cn(headCell, "w-[15%]")}>Revenus</th>
                  <th scope="col" className={cn(headCell, "w-36")}>Reversement</th>
                  <th scope="col" className={cn(headCell, "w-[14%]")}>Dernier virement</th>
                  <th scope="col" className={cn(headCell, "w-34 pr-6 text-right")}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-white/10">
                {pageItems.map((proprietaire) => {
                  const checked = selection.isSelected(proprietaire.id);
                  return (
                    <tr
                      key={proprietaire.id}
                      className={cn(
                        "align-middle transition-colors",
                        checked ? "bg-brand-50/50 dark:bg-brand-900/20" : "hover:bg-zinc-50/70 dark:hover:bg-white/[0.03]",
                        proprietaire.status === "suspendu" && !checked && "text-zinc-500",
                      )}
                    >
                      <td className="py-5 pr-2 pl-6">
                        <input
                          type="checkbox"
                          aria-label={`Sélectionner ${proprietaire.name}`}
                          checked={checked}
                          onChange={() => selection.toggle(proprietaire.id)}
                          className={checkbox}
                        />
                      </td>
                      <td className="px-3 py-5">
                        <ProprietairesIdentity proprietaire={proprietaire} />
                      </td>
                      <td className="px-3 py-5">
                        <PortfolioCell proprietaire={proprietaire} />
                      </td>
                      <td className="px-3 py-5">
                        <RevenueCell proprietaire={proprietaire} />
                      </td>
                      <td className="px-3 py-5">
                        <ReversementBadge proprietaire={proprietaire} />
                      </td>
                      <td className="px-3 py-5">
                        <LastTransferCell proprietaire={proprietaire} />
                      </td>
                      <td className="py-5 pr-6 pl-3">
                        <div className="flex items-center justify-end gap-0.5">
                          <button
                            type="button"
                            title="Voir la fiche"
                            aria-label={`Voir la fiche de ${proprietaire.name}`}
                            onClick={() => onAction?.("voir", proprietaire)}
                            className={cn(iconButton, "text-brand-600 dark:text-brand-100")}
                          >
                            <Icon name="eye" className="size-5" />
                          </button>
                          <button
                            type="button"
                            title="Relevé de gestion"
                            aria-label={`Relevé de gestion de ${proprietaire.name}`}
                            onClick={() => onAction?.("releve", proprietaire)}
                            className={cn(iconButton, "text-brand-600 dark:text-brand-100")}
                          >
                            <Icon name="file" className="size-5" />
                          </button>
                          <ProprietairesRowMenu
                            proprietaire={proprietaire}
                            mandateEndingSoon={isMandateEndingSoon(proprietaire.mandate.endDate, asOf)}
                            onAction={onAction}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <ul className="flex flex-col gap-1 p-3 lg:hidden">
            {pageItems.map((proprietaire) => (
              <li key={proprietaire.id}>
                <ProprietairesCard
                  proprietaire={proprietaire}
                  mandateEndingSoon={isMandateEndingSoon(proprietaire.mandate.endDate, asOf)}
                  onAction={onAction}
                />
              </li>
            ))}
          </ul>
        </>
      )}

      <ProprietairesPagination {...pagination} className="border-t border-zinc-100 px-6 py-4 dark:border-white/10" />
    </section>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-zinc-100 text-zinc-500 dark:bg-white/10 dark:text-zinc-400">
        <Icon name="users" className="size-5" />
      </span>
      <p className="font-semibold text-zinc-900 dark:text-zinc-100">Aucun propriétaire ne correspond</p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">Modifiez la recherche ou réinitialisez les filtres.</p>
    </div>
  );
}

const isoToFr = (iso: string) => iso.split("-").reverse().join("/");

/** Rows for the CSV / PDF export. */
export function proprietairesExportTable(proprietaires: Proprietaire[], asOf: string): ExportTable {
  return {
    title: "Propriétaires ImmoAsk",
    header: [
      "Propriétaire",
      "Profil",
      "Résidence",
      "Téléphone",
      "Statut",
      "Biens",
      "Lots",
      "Mandat",
      "Fin de mandat",
      "Revenus (FCFA/mois)",
      "Frais (%)",
      "Net à reverser (FCFA)",
      "Reversement",
      "Dernier virement",
      "Moyen",
    ],
    rows: proprietaires.map((proprietaire) => [
      proprietaire.name,
      profileLabels[proprietaire.profile],
      proprietaire.residence,
      formatPhone(proprietaire.phone),
      proprietaire.status === "actif" ? "Actif" : `Suspendu — ${proprietaire.statusNote ?? ""}`.trim(),
      proprietaire.biens.length,
      lotCount(proprietaire),
      mandateTypes[proprietaire.mandate.type].label,
      `${isoToFr(proprietaire.mandate.endDate)}${isMandateEndingSoon(proprietaire.mandate.endDate, asOf) ? " (à renouveler)" : ""}`,
      proprietaire.monthlyRevenue,
      proprietaire.mandate.feePercent,
      proprietaire.reversement.status === "en_attente" ? netPayout(proprietaire) : 0,
      proprietaire.reversement.scheduledDate
        ? `${reversementStatuses[proprietaire.reversement.status].label} (${formatTransferDate(proprietaire.reversement.scheduledDate)})`
        : reversementStatuses[proprietaire.reversement.status].label,
      formatTransferDate(proprietaire.reversement.lastTransferDate),
      proprietaire.reversement.label,
    ]),
  };
}
