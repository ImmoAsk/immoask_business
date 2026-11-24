"use client";

import { ExportActions } from "@/components/ui/export_actions";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import type { UseReservationsSelectionResult } from "../hooks/use_reservations_selection";
import type { Reservation } from "../types";
import { fcfa, nightsLabel, percentText, reservationsExportTable, shortDay, StatusBadge, TenantAvatar } from "./reservations_parts";
import { fieldLabel, reservationsPanel } from "./reservations_styles";

const headCell = cn(fieldLabel, "px-3 py-3 text-left whitespace-nowrap");
const checkbox = cn("size-4.5 cursor-pointer rounded accent-brand-600!", focusRing);
/** Columns the detail panel already shows, hidden when it sits beside the table. */
const besidePanel = "min-[100rem]:hidden";
/** Commission also needs the extra width of 2xl when the panel is below. */
const commissionColumn = "hidden 2xl:table-cell min-[100rem]:hidden";

export type ReservationsTableProps = {
  results: Reservation[];
  selectedId: string | null;
  onSelect: (reservation: Reservation) => void;
  /** Checked rows, for the export. */
  selection: UseReservationsSelectionResult;
  className?: string;
};

export function ReservationsTable({ results, selectedId, onSelect, selection, className }: ReservationsTableProps) {
  const ids = results.map((reservation) => reservation.id);
  const checkedCount = selection.selected.length;
  const checkedRows = results.filter((reservation) => selection.isSelected(reservation.id));

  return (
    <section aria-labelledby="reservations-table-title" className={cn(reservationsPanel, "overflow-hidden", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-6 py-4 dark:border-white/10">
        <h2 id="reservations-table-title" className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          {results.length} réservation{results.length > 1 ? "s" : ""} trouvée{results.length > 1 ? "s" : ""}
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
            getTable={() => reservationsExportTable(checkedCount > 0 ? checkedRows : results)}
          />
        </div>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center gap-1 px-6 py-12 text-center">
          <p className="font-semibold text-zinc-900 dark:text-zinc-100">Aucune réservation ne correspond</p>
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
                      aria-label="Sélectionner toutes les réservations affichées"
                      checked={checkedCount > 0 && checkedCount === ids.length}
                      ref={(input) => {
                        if (input) input.indeterminate = checkedCount > 0 && checkedCount < ids.length;
                      }}
                      onChange={() => selection.togglePage(ids)}
                      className={checkbox}
                    />
                  </th>
                  <th scope="col" className={cn(headCell, "w-32")}>N° réservation</th>
                  <th scope="col" className={headCell}>Propriété</th>
                  <th scope="col" className={headCell}>Locataire</th>
                  <th scope="col" className={cn(headCell, "w-36")}>Arrivée → Départ</th>
                  <th scope="col" className={cn(headCell, "w-36", besidePanel)}>Lieu de prise</th>
                  <th scope="col" className={cn(headCell, "w-40", besidePanel)}>Propriétaire</th>
                  <th scope="col" className={cn(headCell, "w-32")}>Montant total</th>
                  <th scope="col" className={cn(headCell, "w-32", commissionColumn)}>Commission</th>
                  <th scope="col" className={cn(headCell, "w-28 pr-6")}>Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-white/10">
                {results.map((reservation) => {
                  const selected = reservation.id === selectedId;
                  const checked = selection.isSelected(reservation.id);
                  return (
                    <tr
                      key={reservation.id}
                      onClick={() => onSelect(reservation)}
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
                          aria-label={`Sélectionner la réservation ${reservation.reference}`}
                          checked={checked}
                          onChange={() => selection.toggle(reservation.id)}
                          className={checkbox}
                        />
                      </td>
                      <td className="px-3 py-3.5">
                        <button
                          type="button"
                          aria-pressed={selected}
                          aria-label={`Voir la réservation ${reservation.reference}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            onSelect(reservation);
                          }}
                          className={cn("rounded font-bold whitespace-nowrap text-brand-700 tabular-nums hover:underline dark:text-brand-100", focusRing)}
                        >
                          {reservation.reference}
                        </button>
                      </td>
                      <td className="truncate px-3 py-3.5 font-semibold text-zinc-950 dark:text-zinc-50" title={reservation.property}>
                        {reservation.property}
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="flex min-w-0 items-center gap-2.5">
                          <TenantAvatar name={reservation.tenant.name} />
                          <span className="truncate font-semibold text-zinc-900 dark:text-zinc-100" title={reservation.tenant.name}>
                            {reservation.tenant.name}
                          </span>
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="block font-semibold whitespace-nowrap text-zinc-900 tabular-nums dark:text-zinc-100">
                          {shortDay(reservation.arrival)} → {shortDay(reservation.departure)}
                        </span>
                        <span className="block text-xs text-zinc-500 dark:text-zinc-400">{nightsLabel(reservation)}</span>
                      </td>
                      <td className={cn("truncate px-3 py-3.5 text-zinc-700 dark:text-zinc-300", besidePanel)} title={reservation.pickup}>
                        {reservation.pickup}
                      </td>
                      <td className={cn("px-3 py-3.5", besidePanel)}>
                        <span className="block truncate font-semibold text-zinc-900 dark:text-zinc-100">{reservation.owner}</span>
                        <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">Gestion · {reservation.manager}</span>
                      </td>
                      <td className="px-3 py-3.5 font-bold whitespace-nowrap text-zinc-950 tabular-nums dark:text-zinc-50">{fcfa(reservation.amount)}</td>
                      <td className={cn("px-3 py-3.5", commissionColumn)}>
                        <span className="block font-bold whitespace-nowrap text-brand-700 tabular-nums dark:text-brand-100">{fcfa(reservation.commission)}</span>
                        <span className="block text-xs text-zinc-500 tabular-nums dark:text-zinc-400">{percentText(reservation)} du montant</span>
                      </td>
                      <td className="py-3.5 pr-6 pl-3">
                        <StatusBadge reservation={reservation} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <ul className="flex flex-col gap-1 p-3 xl:hidden">
            {results.map((reservation) => {
              const selected = reservation.id === selectedId;
              return (
                <li key={reservation.id} className="flex items-center gap-1 pl-2">
                  <input
                    type="checkbox"
                    aria-label={`Sélectionner la réservation ${reservation.reference}`}
                    checked={selection.isSelected(reservation.id)}
                    onChange={() => selection.toggle(reservation.id)}
                    className={checkbox}
                  />
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onSelect(reservation)}
                    className={cn(
                      "flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-2xl p-3 text-left",
                      focusRing,
                      selected ? "bg-brand-50/70 ring-1 ring-brand-200 dark:bg-brand-900/30 dark:ring-brand-700" : "hover:bg-zinc-50 dark:hover:bg-white/5",
                    )}
                  >
                    <TenantAvatar name={reservation.tenant.name} className="size-9" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-zinc-950 dark:text-zinc-50">{reservation.tenant.name}</span>
                      <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="font-semibold text-brand-700 dark:text-brand-100">{reservation.reference}</span> · {reservation.property}
                      </span>
                      <span className="block truncate text-xs text-zinc-500 tabular-nums dark:text-zinc-400">
                        {shortDay(reservation.arrival)} → {shortDay(reservation.departure)} · {nightsLabel(reservation)} · {fcfa(reservation.amount)}
                      </span>
                    </span>
                    <StatusBadge reservation={reservation} />
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
