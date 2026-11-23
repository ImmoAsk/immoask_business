"use client";

import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/utils/dates";
import type { ExportTable } from "@/lib/utils/export";
import { formatPhone } from "@/lib/utils/phone";
import { paymentStatus, remaining } from "../hooks/rent_payments_status";
import type { RentPayment } from "../types";
import { RentPaymentsActions } from "./rent_payments_actions";
import { RentPaymentsCard } from "./rent_payments_card";
import type { RentPaymentsPaginationProps } from "./rent_payments_pagination";
import { RentPaymentsPagination } from "./rent_payments_pagination";
import {
  BienCell,
  PaidCell,
  periodLabel,
  ReferenceCell,
  RentCell,
  settlementLabel,
  SettlementChip,
  StatusBadge,
  statusLabel,
  TenantCell,
} from "./rent_payments_parts";
import type { RentPaymentsRowMenuProps } from "./rent_payments_row_menu";
import { rentPaymentsPanel } from "./rent_payments_styles";

const headCell =
  "px-3 py-4 text-left text-xs font-semibold tracking-wider whitespace-nowrap text-zinc-500 uppercase dark:text-zinc-400";

export type RentPaymentsTableProps = {
  pageItems: RentPayment[];
  total: number;
  asOf: string;
  pagination: RentPaymentsPaginationProps;
  onAction?: RentPaymentsRowMenuProps["onAction"];
  className?: string;
};

export function RentPaymentsTable({ pageItems, total, asOf, pagination, onAction, className }: RentPaymentsTableProps) {
  return (
    <section aria-label="Paiements de loyer" className={cn(rentPaymentsPanel, className)}>
      {total === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-t-3xl xl:block">
            <table className="w-full min-w-[1040px] table-fixed border-collapse text-sm">
              <thead className="bg-zinc-50/80 dark:bg-white/5">
                <tr>
                  <th scope="col" className={cn(headCell, "w-36 pl-6")}>Réf. et date</th>
                  <th scope="col" className={cn(headCell, "w-[19%]")}>Locataire</th>
                  <th scope="col" className={cn(headCell, "w-[16%]")}>Bien et lot</th>
                  <th scope="col" className={cn(headCell, "w-32")}>Loyer</th>
                  <th scope="col" className={cn(headCell, "w-48")}>Payé et reste</th>
                  <th scope="col" className={cn(headCell, "hidden w-44 2xl:table-cell")}>Règlement</th>
                  <th scope="col" className={cn(headCell, "w-40")}>Statut</th>
                  <th scope="col" className={cn(headCell, "w-38 pr-5 text-right")}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-white/10">
                {pageItems.map((payment) => {
                  const late = paymentStatus(payment, asOf) === "en_retard";
                  return (
                    <tr
                      key={payment.id}
                      className={cn(
                        "align-middle transition-colors",
                        late
                          ? "bg-red-50/60 hover:bg-red-50 dark:bg-red-950/20 dark:hover:bg-red-950/30"
                          : "hover:bg-zinc-50/70 dark:hover:bg-white/[0.03]",
                      )}
                    >
                      <td className="py-5 pr-3 pl-6">
                        <ReferenceCell payment={payment} asOf={asOf} />
                      </td>
                      <td className="px-3 py-5">
                        <TenantCell payment={payment} asOf={asOf} />
                      </td>
                      <td className="px-3 py-5">
                        <BienCell payment={payment} />
                      </td>
                      <td className="px-3 py-5">
                        <RentCell payment={payment} asOf={asOf} />
                      </td>
                      <td className="px-3 py-5">
                        {/* The method moves under the bar when its own column is hidden. */}
                        <div className="2xl:hidden">
                          <PaidCell payment={payment} asOf={asOf} showMethod />
                        </div>
                        <div className="hidden 2xl:block">
                          <PaidCell payment={payment} asOf={asOf} />
                        </div>
                      </td>
                      <td className="hidden px-3 py-5 2xl:table-cell">
                        <SettlementChip payment={payment} />
                      </td>
                      <td className="px-3 py-5">
                        <StatusBadge payment={payment} asOf={asOf} />
                      </td>
                      <td className="py-5 pr-5 pl-2">
                        <RentPaymentsActions payment={payment} asOf={asOf} onAction={onAction} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <ul className="flex flex-col gap-1 p-3 xl:hidden">
            {pageItems.map((payment) => (
              <li key={payment.id}>
                <RentPaymentsCard payment={payment} asOf={asOf} onAction={onAction} />
              </li>
            ))}
          </ul>
        </>
      )}

      <RentPaymentsPagination {...pagination} className="border-t border-zinc-100 px-6 py-4 dark:border-white/10" />
    </section>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-900/60 dark:text-brand-100">
        <Icon name="receipt" className="size-5" />
      </span>
      <p className="font-semibold text-zinc-900 dark:text-zinc-100">Aucun paiement ne correspond</p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">Modifiez la recherche ou réinitialisez les filtres.</p>
    </div>
  );
}

/** Rows for the CSV / PDF export. */
export function rentPaymentsExportTable(payments: RentPayment[], asOf: string): ExportTable {
  return {
    title: "Paiements de loyer ImmoAsk",
    header: [
      "Référence",
      "Période",
      "Échéance",
      "Date de paiement",
      "Locataire",
      "Téléphone",
      "Bien",
      "Lot",
      "Quartier",
      "Loyer (FCFA)",
      "Payé (FCFA)",
      "Reste (FCFA)",
      "Règlement",
      "Statut",
    ],
    rows: payments.map((payment) => [
      payment.reference,
      periodLabel(payment),
      formatShortDate(payment.dueDate),
      payment.paidDate ? formatShortDate(payment.paidDate) : "",
      payment.tenant.name,
      formatPhone(payment.tenant.phone),
      payment.bien.title,
      payment.bien.lot ?? "",
      `${payment.bien.quartier}, ${payment.bien.city}`,
      payment.rent,
      payment.paid,
      remaining(payment),
      settlementLabel(payment),
      statusLabel(payment, asOf),
    ]),
  };
}
