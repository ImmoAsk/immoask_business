"use client";

import { ExportActions } from "@/components/ui/export_actions";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import type { ExportTable } from "@/lib/utils/export";
import type { usePortofolioSelection } from "../hooks/use_portofolio_selection";
import type { PortofolioBien } from "../types";
import { PortofoliosBienCard } from "./portofolios_bien_card";
import {
  PortofoliosFeatures,
  PortofoliosLocation,
  PortofoliosOccupant,
  PortofoliosRent,
  PortofoliosStatusBadge,
  PortofoliosThumbnail,
  statusLabel,
} from "./portofolios_bien_parts";
import type { PortofoliosPaginationProps } from "./portofolios_pagination";
import { PortofoliosPagination } from "./portofolios_pagination";
import type { PortofoliosRowMenuProps } from "./portofolios_row_menu";
import { PortofoliosRowMenu } from "./portofolios_row_menu";
import { portofolioPanel } from "./portofolios_styles";

const checkbox = cn("size-4.5 cursor-pointer rounded accent-brand-600!", focusRing);
const headCell = "px-3 py-4 text-left text-[13px] font-semibold whitespace-nowrap text-zinc-700 dark:text-zinc-200";

export type PortofoliosTableauProps = {
  /** All results (for export), and the rows of the current page. */
  results: PortofolioBien[];
  pageItems: PortofolioBien[];
  selection: ReturnType<typeof usePortofolioSelection>;
  pagination: PortofoliosPaginationProps;
  onAction?: PortofoliosRowMenuProps["onAction"];
  className?: string;
};

export function PortofoliosTableau({
  results,
  pageItems,
  selection,
  pagination,
  onAction,
  className,
}: PortofoliosTableauProps) {
  const pageIds = pageItems.map((bien) => bien.id);
  const checkedOnPage = pageIds.filter(selection.isSelected).length;
  const selectedCount = selection.selected.length;

  return (
    <section aria-labelledby="portofolio-table-title" className={cn(portofolioPanel, "overflow-hidden", className)}>
      <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-6 py-3 dark:border-white/10">
        <h2 id="portofolio-table-title" className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          {results.length} bien{results.length > 1 ? "s" : ""} trouvé{results.length > 1 ? "s" : ""}
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
              portofolioExportTable(
                selectedCount > 0 ? results.filter((bien) => selection.isSelected(bien.id)) : results,
              )
            }
          />
        </div>
      </div>

      {results.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Wide screens: full table. */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1000px] table-fixed border-collapse text-sm">
              <thead className="bg-zinc-50/80 dark:bg-white/5">
                <tr>
                  <th scope="col" className="w-12 py-4 pr-2 pl-6">
                    <input
                      type="checkbox"
                      aria-label="Sélectionner les biens de la page"
                      checked={checkedOnPage > 0 && checkedOnPage === pageIds.length}
                      ref={(input) => {
                        if (input) input.indeterminate = checkedOnPage > 0 && checkedOnPage < pageIds.length;
                      }}
                      onChange={() => selection.togglePage(pageIds)}
                      className={checkbox}
                    />
                  </th>
                  <th scope="col" className={cn(headCell, "w-[24%]")}>Bien & Réf.</th>
                  <th scope="col" className={cn(headCell, "hidden w-36 2xl:table-cell")}>Photo</th>
                  <th scope="col" className={cn(headCell, "w-[15%]")}>Localisation</th>
                  <th scope="col" className={cn(headCell, "w-[22%]")}>Caractéristiques</th>
                  <th scope="col" className={cn(headCell, "w-28")}>Statut</th>
                  <th scope="col" className={cn(headCell, "w-[21%]")}>Contrat & Locataire</th>
                  <th scope="col" className={cn(headCell, "w-32")}>Loyer / Valeur</th>
                  <th scope="col" className={cn(headCell, "w-20 pr-6 text-right")}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-white/10">
                {pageItems.map((bien) => {
                  const checked = selection.isSelected(bien.id);
                  return (
                    <tr
                      key={bien.id}
                      className={cn(
                        "align-middle transition-colors",
                        checked ? "bg-brand-50/50 dark:bg-brand-900/20" : "hover:bg-zinc-50/70 dark:hover:bg-white/[0.03]",
                      )}
                    >
                      <td className="py-5 pr-2 pl-6">
                        <input
                          type="checkbox"
                          aria-label={`Sélectionner ${bien.title}`}
                          checked={checked}
                          onChange={() => selection.toggle(bien.id)}
                          className={checkbox}
                        />
                      </td>
                      <td className="px-3 py-5">
                        <div className="flex items-center gap-3">
                          {/* The photo gets its own column on very wide screens only. */}
                          <PortofoliosThumbnail bien={bien} compact className="size-14 rounded-xl 2xl:hidden" />
                          <div className="min-w-0">
                            <p className="font-semibold text-zinc-950 dark:text-zinc-50">{bien.title}</p>
                            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Réf. {bien.reference}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-3 py-5 2xl:table-cell">
                        <PortofoliosThumbnail bien={bien} className="h-24 w-full" />
                      </td>
                      <td className="px-3 py-5">
                        <PortofoliosLocation bien={bien} />
                      </td>
                      <td className="px-3 py-5">
                        <PortofoliosFeatures bien={bien} />
                      </td>
                      <td className="px-3 py-5">
                        <PortofoliosStatusBadge bien={bien} />
                      </td>
                      <td className="px-3 py-5">
                        <PortofoliosOccupant bien={bien} />
                      </td>
                      <td className="px-3 py-5">
                        <PortofoliosRent bien={bien} />
                      </td>
                      <td className="py-5 pr-6 pl-3">
                        <div className="flex justify-end">
                          <PortofoliosRowMenu bien={bien} onAction={onAction} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Small screens: one card per property. */}
          <ul className="divide-y divide-zinc-100 p-3 lg:hidden dark:divide-white/10">
            {pageItems.map((bien) => (
              <li key={bien.id} className="py-1">
                <PortofoliosBienCard bien={bien} onAction={onAction} />
              </li>
            ))}
          </ul>
        </>
      )}

      <PortofoliosPagination {...pagination} className="border-t border-zinc-100 px-6 py-4 dark:border-white/10" />
    </section>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-zinc-100 text-zinc-500 dark:bg-white/10 dark:text-zinc-400">
        <Icon name="search" className="size-5" />
      </span>
      <p className="font-semibold text-zinc-900 dark:text-zinc-100">Aucun bien ne correspond</p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">Modifiez la recherche ou réinitialisez les filtres.</p>
    </div>
  );
}

/** Rows for the CSV / PDF export. */
export function portofolioExportTable(biens: PortofolioBien[]): ExportTable {
  return {
    title: "Patrimoine ImmoAsk",
    header: ["Référence", "Bien", "Quartier", "Ville", "Zone", "Statut", "Occupant", "Loyer (FCFA/mois)"],
    rows: biens.map((bien) => [
      bien.reference,
      bien.title,
      bien.location.quartier,
      bien.location.city,
      bien.location.zone,
      statusLabel(bien),
      bien.occupant.kind === "locataire" ? bien.occupant.name : bien.occupant.label,
      bien.rent,
    ]),
  };
}
