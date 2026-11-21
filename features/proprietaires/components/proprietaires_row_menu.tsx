"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import type { Proprietaire } from "../types";

export type ProprietaireRowAction = "voir" | "releve" | "virement" | "renouveler" | "modifier";

export type ProprietairesRowMenuProps = {
  proprietaire: Proprietaire;
  /** Mandate ends within the renewal window: offers "Renouveler le mandat". */
  mandateEndingSoon?: boolean;
  onAction?: (action: ProprietaireRowAction, proprietaire: Proprietaire) => void;
};

const item = cn(
  "flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-white/5",
  focusRing,
);

/** "⋮" menu of an owner. Closes on Escape, on pick, or when focus leaves it. */
export function ProprietairesRowMenu({ proprietaire, mandateEndingSoon = false, onAction }: ProprietairesRowMenuProps) {
  const [open, setOpen] = useState(false);
  const menuId = `proprietaire-menu-${proprietaire.id}`;
  const pick = (action: ProprietaireRowAction) => {
    setOpen(false);
    onAction?.(action, proprietaire);
  };

  return (
    <div
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      <button
        type="button"
        aria-label={`Plus d'actions pour ${proprietaire.name}`}
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
            <button type="button" role="menuitem" className={item} onClick={() => pick("voir")}>
              <Icon name="eye" className="size-4 text-zinc-400" /> Voir la fiche
            </button>
          </li>
          <li role="none">
            <button type="button" role="menuitem" className={item} onClick={() => pick("releve")}>
              <Icon name="file" className="size-4 text-zinc-400" /> Relevé de gestion
            </button>
          </li>
          {proprietaire.reversement.status === "en_attente" ? (
            <li role="none">
              <button type="button" role="menuitem" className={item} onClick={() => pick("virement")}>
                <Icon name="bank" className="size-4 text-brand-600 dark:text-brand-100" /> Lancer le virement
              </button>
            </li>
          ) : null}
          <li role="none">
            <a
              role="menuitem"
              href={`https://wa.me/${proprietaire.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className={item}
              onClick={() => setOpen(false)}
            >
              <Icon name="whatsapp" className="size-4 text-brand-600" /> Écrire sur WhatsApp
            </a>
          </li>
          <li role="none">
            <a role="menuitem" href={`tel:${proprietaire.phone}`} className={item} onClick={() => setOpen(false)}>
              <Icon name="phone" className="size-4 text-zinc-400" /> Appeler
            </a>
          </li>
          {mandateEndingSoon ? (
            <li role="none">
              <button type="button" role="menuitem" className={item} onClick={() => pick("renouveler")}>
                <Icon name="calendar" className="size-4 text-zinc-400" /> Renouveler le mandat
              </button>
            </li>
          ) : null}
          <li role="none">
            <button type="button" role="menuitem" className={item} onClick={() => pick("modifier")}>
              <Icon name="clipboard" className="size-4 text-zinc-400" /> Modifier le propriétaire
            </button>
          </li>
        </ul>
      ) : null}
    </div>
  );
}
