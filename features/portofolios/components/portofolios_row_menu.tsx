"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import type { PortofolioBien } from "../types";

export type PortofolioRowAction = "voir" | "modifier" | "bail" | "intervention";

function actionsFor(bien: PortofolioBien): { action: PortofolioRowAction; label: string }[] {
  return [
    { action: "voir", label: "Voir la fiche" },
    { action: "modifier", label: "Modifier le bien" },
    ...(bien.status === "vacant" ? [{ action: "bail" as const, label: "Créer un bail" }] : []),
    { action: "intervention", label: "Signaler une intervention" },
  ];
}

export type PortofoliosRowMenuProps = {
  bien: PortofolioBien;
  onAction?: (action: PortofolioRowAction, bien: PortofolioBien) => void;
};

/** "⋮" menu of a property. Closes on Escape, on pick, or when focus leaves it. */
export function PortofoliosRowMenu({ bien, onAction }: PortofoliosRowMenuProps) {
  const [open, setOpen] = useState(false);
  const menuId = `portofolio-menu-${bien.id}`;

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
        aria-label={`Actions pour ${bien.title}`}
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
          className="absolute top-full right-0 z-20 mt-1 w-56 rounded-2xl border border-zinc-100 bg-white p-1.5 shadow-lg dark:border-white/10 dark:bg-zinc-900"
        >
          {actionsFor(bien).map((item) => (
            <li key={item.action} role="none">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  onAction?.(item.action, bien);
                }}
                className={cn(
                  "w-full cursor-pointer rounded-xl px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-white/5",
                  focusRing,
                )}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
