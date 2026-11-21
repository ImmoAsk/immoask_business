"use client";

import { ExportActions } from "@/components/ui/export_actions";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import type { ExportTable } from "@/lib/utils/export";
import { isLeaseEndingSoon } from "../hooks/locataires_dates";
import type { UseLocatairesSelectionResult } from "../hooks/use_locataires_selection";
import type { Locataire } from "../types";
import { LocatairesCard } from "./locataires_card";
import type { LocatairesPaginationProps } from "./locataires_pagination";
import { LocatairesPagination } from "./locataires_pagination";
import {
  formatDayMonth,
  formatPhone,
  LocatairesBienCell,
  LocatairesIdentity,
  LocatairesRent,
  PaymentBadge,
  paymentLabel,
  QuittanceCell,
} from "./locataires_parts";
import type { LocataireRowAction } from "./locataires_row_menu";
import { LocatairesRowMenu } from "./locataires_row_menu";
import { leaseTypes, locatairesPanel } from "./locataires_styles";

const checkbox = cn("size-4.5 cursor-pointer rounded accent-brand-600!", focusRing);
const headCell =
  "px-3 py-4 text-left text-xs font-semibold tracking-wide whitespace-nowrap text-zinc-500 uppercase dark:text-zinc-400";
const iconButton = cn(
  "grid size-9 cursor-pointer place-items-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white",
  focusRing,
);

export type LocatairesTableProps = {
  /** All results (for export), and the rows of the current page. */
  results: Locataire[];
  pageItems: Locataire[];
  asOf: string;
  selection: UseLocatairesSelectionResult;
  pagination: LocatairesPaginationProps;
  onAction?: (action: LocataireRowAction, locataire: Locataire) => void;
  className?: string;
};

export function LocatairesTable({
  results,
  pageItems,
  asOf,
  selection,
  pagination,
  onAction,
  className,
}: LocatairesTableProps) {
  const pageIds = pageItems.map((locataire) => locataire.id);
  const checkedOnPage = pageIds.filter(selection.isSelected).length;
  const selectedCount = selection.selected.length;

  return (
    <section aria-labelledby="locataires-table-title" className={cn(locatairesPanel, "overflow-hidden", className)}>
      <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-6 py-3 dark:border-white/10">
        <h2 id="locataires-table-title" className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          {results.length} locataire{results.length > 1 ? "s" : ""} trouvé{results.length > 1 ? "s" : ""}
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
              locatairesExportTable(
                selectedCount > 0 ? results.filter((locataire) => selection.isSelected(locataire.id)) : results,
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
                      aria-label="Sélectionner les locataires de la page"
                      checked={checkedOnPage > 0 && checkedOnPage === pageIds.length}
                      ref={(input) => {
                        if (input) input.indeterminate = checkedOnPage > 0 && checkedOnPage < pageIds.length;
                      }}
                      onChange={() => selection.togglePage(pageIds)}
                      className={checkbox}
                    />
                  </th>
                  <th scope="col" className={cn(headCell, "w-[22%]")}>Locataire</th>
                  <th scope="col" className={cn(headCell, "w-[27%]")}>Bien occupé & lot</th>
                  <th scope="col" className={cn(headCell, "w-[13%]")}>Loyer mensuel</th>
                  <th scope="col" className={cn(headCell, "w-32")}>Statut paiement</th>
                  <th scope="col" className={cn(headCell, "w-[18%]")}>Dernière quittance</th>
                  <th scope="col" className={cn(headCell, "w-34 pr-6 text-right")}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-white/10">
                {pageItems.map((locataire) => {
                  const checked = selection.isSelected(locataire.id);
                  const late = locataire.payment.status === "en_retard";
                  return (
                    <tr
                      key={locataire.id}
                      className={cn(
                        "align-middle transition-colors",
                        checked
                          ? "bg-brand-50/50 dark:bg-brand-900/20"
                          : late
                            ? "bg-orange-50/40 hover:bg-orange-50/70 dark:bg-orange-950/20 dark:hover:bg-orange-950/30"
                            : "hover:bg-zinc-50/70 dark:hover:bg-white/[0.03]",
                      )}
                    >
                      <td className="py-4 pr-2 pl-6">
                        <input
                          type="checkbox"
                          aria-label={`Sélectionner ${locataire.name}`}
                          checked={checked}
                          onChange={() => selection.toggle(locataire.id)}
                          className={checkbox}
                        />
                      </td>
                      <td className="px-3 py-4">
                        <LocatairesIdentity locataire={locataire} />
                      </td>
                      <td className="px-3 py-4">
                        <LocatairesBienCell locataire={locataire} />
                      </td>
                      <td className="px-3 py-4">
                        <LocatairesRent locataire={locataire} />
                      </td>
                      <td className="px-3 py-4">
                        <PaymentBadge locataire={locataire} />
                      </td>
                      <td className="px-3 py-4">
                        <QuittanceCell locataire={locataire} />
                      </td>
                      <td className="py-4 pr-6 pl-3">
                        <div className="flex items-center justify-end gap-0.5">
                          <button
                            type="button"
                            title="Envoyer la quittance"
                            aria-label={`Envoyer la quittance à ${locataire.name}`}
                            onClick={() => onAction?.("quittance", locataire)}
                            className={cn(iconButton, "text-brand-600 dark:text-brand-100")}
                          >
                            <Icon name="receipt" className="size-5" />
                          </button>
                          <button
                            type="button"
                            title="Voir la fiche"
                            aria-label={`Voir la fiche de ${locataire.name}`}
                            onClick={() => onAction?.("voir", locataire)}
                            className={iconButton}
                          >
                            <Icon name="eye" className="size-5" />
                          </button>
                          <LocatairesRowMenu
                            locataire={locataire}
                            leaseEndingSoon={isLeaseEndingSoon(locataire.lease.endDate, asOf)}
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
            {pageItems.map((locataire) => (
              <li key={locataire.id}>
                <LocatairesCard
                  locataire={locataire}
                  leaseEndingSoon={isLeaseEndingSoon(locataire.lease.endDate, asOf)}
                  onAction={onAction}
                />
              </li>
            ))}
          </ul>
        </>
      )}

      <LocatairesPagination {...pagination} className="border-t border-zinc-100 px-6 py-4 dark:border-white/10" />
    </section>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-zinc-100 text-zinc-500 dark:bg-white/10 dark:text-zinc-400">
        <Icon name="users" className="size-5" />
      </span>
      <p className="font-semibold text-zinc-900 dark:text-zinc-100">Aucun locataire ne correspond</p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">Modifiez la recherche ou réinitialisez les filtres.</p>
    </div>
  );
}

function quittanceText(locataire: Locataire) {
  const quittance = locataire.lastQuittance;
  switch (quittance.kind) {
    case "envoyee":
      return `Envoyée le ${formatDayMonth(quittance.date)} (n°${quittance.numero})`;
    case "en_attente":
      return `En attente règlement — ${quittance.note}`;
    case "relance":
      return `Relance le ${formatDayMonth(quittance.date)}${quittance.promiseDate ? `, promesse au ${formatDayMonth(quittance.promiseDate)}` : ""}`;
  }
}

/** Rows for the CSV / PDF export. */
export function locatairesExportTable(locataires: Locataire[]): ExportTable {
  return {
    title: "Locataires ImmoAsk",
    header: [
      "Locataire",
      "Téléphone",
      "Activité",
      "Bien",
      "Réf. lot",
      "Quartier",
      "Ville",
      "Bail",
      "Fin de bail",
      "Loyer (FCFA/mois)",
      "Paiement",
      "Statut",
      "Dernière quittance",
    ],
    rows: locataires.map((locataire) => [
      locataire.name,
      formatPhone(locataire.phone),
      locataire.occupation,
      locataire.bien.title,
      locataire.bien.reference,
      locataire.bien.quartier,
      locataire.bien.city,
      leaseTypes[locataire.lease.type].label,
      locataire.lease.endDate.split("-").reverse().join("/"),
      locataire.rent,
      locataire.payment.label,
      paymentLabel(locataire),
      quittanceText(locataire),
    ]),
  };
}
