"use client";

import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/utils/dates";
import type { ExportTable } from "@/lib/utils/export";
import { formatPhone } from "@/lib/utils/phone";
import { collectionTotal, lineCommission, linesTotal, natureLabel } from "../hooks/rent_collections_money";
import type { RentCollection } from "../types";
import { RentCollectionsCard } from "./rent_collections_card";
import type { RentCollectionsPaginationProps } from "./rent_collections_pagination";
import { RentCollectionsPagination } from "./rent_collections_pagination";
import { AmountCell, BienCell, channelText, ReferenceCell, StatusBadge, statusLabel, TenantCell } from "./rent_collections_parts";
import { rentCollectionsPanel } from "./rent_collections_styles";

const headCell =
  "px-3 py-4 text-left text-xs font-semibold tracking-wider whitespace-nowrap text-zinc-500 uppercase dark:text-zinc-400";

export type RentCollectionsTableProps = {
  pageItems: RentCollection[];
  total: number;
  selectedId: string | null;
  onSelect: (collection: RentCollection) => void;
  pagination: RentCollectionsPaginationProps;
  className?: string;
};

export function RentCollectionsTable({
  pageItems,
  total,
  selectedId,
  onSelect,
  pagination,
  className,
}: RentCollectionsTableProps) {
  return (
    <section aria-label="Liste des encaissements" className={cn(rentCollectionsPanel, "overflow-hidden", className)}>
      {total === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="hidden overflow-x-auto xl:block">
            <table className="w-full min-w-[860px] table-fixed border-collapse text-sm">
              <thead className="bg-zinc-50/80 dark:bg-white/5">
                <tr>
                  <th scope="col" className={cn(headCell, "w-36 pl-6")}>Réf. et date</th>
                  <th scope="col" className={cn(headCell, "w-[25%]")}>Locataire</th>
                  <th scope="col" className={cn(headCell, "w-[25%]")}>Bien et nature</th>
                  <th scope="col" className={cn(headCell, "w-[22%] text-right")}>Montant</th>
                  <th scope="col" className={cn(headCell, "w-38 pl-4")}>Statut</th>
                  <th scope="col" className="w-11 pr-3">
                    <span className="sr-only">Détail</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-white/10">
                {pageItems.map((collection) => {
                  const selected = collection.id === selectedId;
                  return (
                    <tr
                      key={collection.id}
                      onClick={() => onSelect(collection)}
                      className={cn(
                        "cursor-pointer align-middle transition-colors",
                        selected
                          ? "bg-brand-50/70 shadow-[inset_4px_0_0_var(--color-brand-600)] dark:bg-brand-900/30"
                          : "hover:bg-zinc-50/70 dark:hover:bg-white/[0.03]",
                      )}
                    >
                      <td className="py-5 pr-3 pl-6">
                        <ReferenceCell collection={collection} />
                      </td>
                      <td className="px-3 py-5">
                        <TenantCell collection={collection} />
                      </td>
                      <td className="px-3 py-5">
                        <BienCell collection={collection} />
                      </td>
                      <td className="px-3 py-5">
                        <AmountCell collection={collection} />
                      </td>
                      <td className="py-5 pr-3 pl-4">
                        <StatusBadge collection={collection} />
                      </td>
                      <td className="py-5 pr-3">
                        <button
                          type="button"
                          aria-label={`Voir le détail de ${collection.reference}`}
                          aria-pressed={selected}
                          onClick={(event) => {
                            event.stopPropagation();
                            onSelect(collection);
                          }}
                          className={cn(
                            "grid size-8 cursor-pointer place-items-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 dark:hover:text-white",
                            selected && "text-brand-600 dark:text-brand-100",
                            focusRing,
                          )}
                        >
                          <Icon name="chevronRight" className="size-4.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <ul className="flex flex-col gap-1 p-3 xl:hidden">
            {pageItems.map((collection) => (
              <li key={collection.id}>
                <RentCollectionsCard collection={collection} selected={collection.id === selectedId} onSelect={onSelect} />
              </li>
            ))}
          </ul>
        </>
      )}

      <RentCollectionsPagination {...pagination} className="border-t border-zinc-100 px-6 py-4 dark:border-white/10" />
    </section>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-900/60 dark:text-brand-100">
        <Icon name="receipt" className="size-5" />
      </span>
      <p className="font-semibold text-zinc-900 dark:text-zinc-100">Aucun encaissement ne correspond</p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">Modifiez la recherche ou réinitialisez les filtres.</p>
    </div>
  );
}

/** Rows for the CSV / PDF export. */
export function rentCollectionsExportTable(collections: RentCollection[]): ExportTable {
  return {
    title: "Encaissements ImmoAsk",
    header: [
      "Référence",
      "Date",
      "Locataire",
      "Téléphone",
      "Bien",
      "Quartier",
      "Nature",
      "Loyer (FCFA)",
      "Charges (FCFA)",
      "Cautions & services (FCFA)",
      "Total (FCFA)",
      "Commission (FCFA)",
      "Canal",
      "Statut",
    ],
    rows: collections.map((collection) => [
      collection.reference,
      formatShortDate(collection.date),
      collection.tenant.name,
      formatPhone(collection.tenant.phone),
      collection.bien.title,
      `${collection.bien.quartier}, ${collection.bien.city}`,
      natureLabel(collection),
      linesTotal(collection, "loyer"),
      linesTotal(collection, "charges"),
      linesTotal(collection, "caution") + linesTotal(collection, "service"),
      collectionTotal(collection),
      collection.lines.reduce((sum, line) => sum + lineCommission(line), 0),
      channelText(collection),
      statusLabel(collection),
    ]),
  };
}
