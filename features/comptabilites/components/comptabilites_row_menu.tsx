"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { printPdf } from "@/lib/utils/export";
import type { ExportTable } from "@/lib/utils/export";
import { formatAmount } from "@/lib/utils/format";
import { COMPTABILITE_CATEGORIES } from "../hooks/comptabilites_categories";
import type { ComptabiliteOperation } from "../types";
import { formatDateNumeric } from "./comptabilites_parts";
import { statusStyle } from "./comptabilites_styles";

const item = cn(
  "flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-white/5",
  focusRing,
);

/** Printable voucher ("pièce comptable") of one operation. */
export function voucherTable(operation: ComptabiliteOperation): ExportTable {
  return {
    title: `Pièce comptable ${operation.reference}`,
    header: ["Rubrique", "Valeur"],
    rows: [
      ["Date", formatDateNumeric(operation.date)],
      ["Sens", operation.flow === "recette" ? "Recette" : "Dépense"],
      ["Catégorie", COMPTABILITE_CATEGORIES[operation.category].label],
      ["Description", operation.description],
      ["Bien concerné", operation.bien],
      ["Locataire / Tiers", operation.counterparty ?? "—"],
      ["Montant", `${formatAmount(operation.amount)} FCFA`],
      ["Statut", statusStyle(operation.status, operation.flow).label],
    ],
    footer: "Pièce générée par ImmoAsk Business.",
  };
}

export type ComptabilitesRowMenuProps = { operation: ComptabiliteOperation };

/** "⋮" menu of an operation. Closes on Escape, on pick, or when focus leaves it. */
export function ComptabilitesRowMenu({ operation }: ComptabilitesRowMenuProps) {
  const [open, setOpen] = useState(false);
  const menuId = `comptabilite-menu-${operation.id}`;
  const close = () => setOpen(false);
  const tenant = operation.flow === "recette" && operation.counterparty;

  return (
    <div
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) close();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") close();
      }}
    >
      <button
        type="button"
        aria-label={`Plus d'actions pour ${operation.reference}`}
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
          className="absolute top-full right-0 z-20 mt-1 w-60 rounded-2xl border border-zinc-100 bg-white p-1.5 shadow-lg dark:border-white/10 dark:bg-zinc-900"
        >
          <li role="none">
            <button
              type="button"
              role="menuitem"
              className={item}
              onClick={() => {
                close();
                printPdf(voucherTable(operation));
              }}
            >
              <Icon name="download" className="size-4 text-zinc-400" /> Pièce comptable (PDF)
            </button>
          </li>
          <li role="none">
            <Link role="menuitem" href="/app/portofolio" className={item} onClick={close}>
              <Icon name="building" className="size-4 text-zinc-400" /> Voir le bien
            </Link>
          </li>
          {tenant ? (
            <li role="none">
              <Link role="menuitem" href="/app/locataires" className={item} onClick={close}>
                <Icon name="users" className="size-4 text-zinc-400" /> Voir le locataire
              </Link>
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
