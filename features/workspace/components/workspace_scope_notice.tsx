"use client";

import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { useWorkspace } from "../hooks/workspace_context";

/** Tells which contract and period the screen is narrowed to, with a way back to everything. */
export function WorkspaceScopeNotice({ className }: { className?: string }) {
  const { scope, reset } = useWorkspace();
  if (!scope.isFiltered) return null;

  const parts = [
    scope.contract ? `${scope.contract.reference} · ${scope.contract.owner}` : "Tous les contrats",
    scope.period ? scope.period.label : "Toute la période",
  ];

  return (
    <p
      role="status"
      className={cn(
        "inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-2xl bg-brand-50 py-1.5 pr-1.5 pl-3 text-[13px] text-brand-800 dark:bg-brand-900/50 dark:text-brand-100",
        className,
      )}
    >
      <Icon name="filter" className="size-4 shrink-0" />
      <span className="min-w-0">
        Vue filtrée : <span className="font-semibold">{parts.join(" · ")}</span>
      </span>
      <button
        type="button"
        onClick={reset}
        className={cn(
          "h-7 cursor-pointer rounded-xl bg-white px-2.5 text-xs font-bold text-brand-700 shadow-sm hover:bg-brand-100 dark:bg-zinc-950 dark:text-brand-100 dark:hover:bg-brand-900",
          focusRing,
        )}
      >
        Tout afficher
      </button>
    </p>
  );
}
