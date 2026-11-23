"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { printPdf } from "@/lib/utils/export";
import type { RentPayment } from "../types";
import { receiptTable, whatsappMessageUrl } from "./rent_payments_parts";

export type RentPaymentRowAction = "enregistrer";

export type RentPaymentsRowMenuProps = {
  payment: RentPayment;
  asOf: string;
  onAction?: (action: RentPaymentRowAction, payment: RentPayment) => void;
};

const item = cn(
  "flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-200 dark:hover:bg-white/5",
  focusRing,
);

/** "⋮" menu of a payment. Closes on Escape, on pick, or when focus leaves it. */
export function RentPaymentsRowMenu({ payment, asOf, onAction }: RentPaymentsRowMenuProps) {
  const [open, setOpen] = useState(false);
  const menuId = `rent-payment-menu-${payment.id}`;
  const close = () => setOpen(false);

  return (
    <div
      className="relative"
      onClick={(event) => event.stopPropagation()}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) close();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") close();
      }}
    >
      <button
        type="button"
        aria-label={`Plus d'actions pour ${payment.reference}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "grid size-9 cursor-pointer place-items-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white",
          focusRing,
        )}
      >
        <Icon name="moreVertical" className="size-5" strokeWidth={2.5} />
      </button>
      {open ? (
        <ul
          id={menuId}
          role="menu"
          className="absolute top-full right-0 z-20 mt-1 w-64 rounded-2xl border border-zinc-100 bg-white p-1.5 shadow-lg dark:border-white/10 dark:bg-zinc-900"
        >
          <li role="none">
            <button
              type="button"
              role="menuitem"
              className={item}
              onClick={() => {
                close();
                onAction?.("enregistrer", payment);
              }}
            >
              <Icon name="plus" className="size-4 text-zinc-400" /> Enregistrer un paiement
            </button>
          </li>
          <li role="none">
            <button
              type="button"
              role="menuitem"
              disabled={payment.paid === 0}
              className={item}
              onClick={() => {
                close();
                printPdf(receiptTable(payment, asOf));
              }}
            >
              <Icon name="download" className="size-4 text-zinc-400" />
              {payment.paid >= payment.rent ? "Télécharger la quittance" : "Télécharger le reçu"}
            </button>
          </li>
          <li role="none">
            <a role="menuitem" href={whatsappMessageUrl(payment, asOf)} target="_blank" rel="noreferrer" className={item} onClick={close}>
              <Icon name="whatsapp" className="size-4 text-brand-600" /> Message WhatsApp
            </a>
          </li>
          <li role="none">
            <a role="menuitem" href={`tel:${payment.tenant.phone}`} className={item} onClick={close}>
              <Icon name="phone" className="size-4 text-zinc-400" /> Appeler
            </a>
          </li>
          <li role="none">
            <Link role="menuitem" href="/app/locataires" className={item} onClick={close}>
              <Icon name="users" className="size-4 text-zinc-400" /> Voir le locataire
            </Link>
          </li>
        </ul>
      ) : null}
    </div>
  );
}
