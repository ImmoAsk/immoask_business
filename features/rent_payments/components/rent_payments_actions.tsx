"use client";

import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { printPdf } from "@/lib/utils/export";
import { paymentStatus } from "../hooks/rent_payments_status";
import type { RentPayment } from "../types";
import { receiptTable, whatsappMessageUrl } from "./rent_payments_parts";
import type { RentPaymentsRowMenuProps } from "./rent_payments_row_menu";
import { RentPaymentsRowMenu } from "./rent_payments_row_menu";

const iconButton = cn(
  "grid size-9 cursor-pointer place-items-center rounded-full text-brand-600 hover:bg-brand-50 disabled:cursor-not-allowed disabled:text-zinc-300 disabled:hover:bg-transparent dark:text-brand-100 dark:hover:bg-brand-900/40 dark:disabled:text-zinc-600",
  focusRing,
);

/** Receipt, WhatsApp message and menu; late payments get a "Relancer" button instead. */
export function RentPaymentsActions({
  payment,
  asOf,
  onAction,
}: {
  payment: RentPayment;
  asOf: string;
  onAction?: RentPaymentsRowMenuProps["onAction"];
}) {
  const late = paymentStatus(payment, asOf) === "en_retard";
  const full = payment.paid >= payment.rent;

  return (
    <div className="flex items-center justify-end gap-0.5">
      {late ? (
        <a
          href={whatsappMessageUrl(payment, asOf)}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "inline-flex h-9 items-center gap-1.5 rounded-xl bg-brand-600 px-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 dark:bg-brand-500",
            focusRing,
          )}
        >
          <Icon name="whatsapp" className="size-4" />
          Relancer
        </a>
      ) : (
        <>
          <button
            type="button"
            title={payment.paid === 0 ? "Aucun montant reçu" : full ? "Télécharger la quittance" : "Télécharger le reçu"}
            aria-label={`${full ? "Quittance" : "Reçu"} de ${payment.reference}`}
            disabled={payment.paid === 0}
            onClick={() => printPdf(receiptTable(payment, asOf))}
            className={iconButton}
          >
            <Icon name="file" className="size-5" />
          </button>
          <a
            href={whatsappMessageUrl(payment, asOf)}
            target="_blank"
            rel="noreferrer"
            title="Message WhatsApp"
            aria-label={`Écrire à ${payment.tenant.name} sur WhatsApp`}
            className={iconButton}
          >
            <Icon name="message" className="size-5" />
          </a>
        </>
      )}
      <RentPaymentsRowMenu payment={payment} asOf={asOf} onAction={onAction} />
    </div>
  );
}
