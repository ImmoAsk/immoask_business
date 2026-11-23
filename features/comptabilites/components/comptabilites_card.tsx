import { COMPTABILITE_CATEGORIES } from "../hooks/comptabilites_categories";
import type { ComptabiliteOperation } from "../types";
import { AmountText, formatDateNumeric, StatusBadge } from "./comptabilites_parts";
import { ComptabilitesRowMenu } from "./comptabilites_row_menu";
import { categoryIcons, flowTiles } from "./comptabilites_styles";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

/** Compact row for small screens. */
export function ComptabilitesCard({ operation }: { operation: ComptabiliteOperation }) {
  return (
    <article className="flex items-start gap-3 rounded-2xl p-3 hover:bg-zinc-50 dark:hover:bg-white/5">
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", flowTiles[operation.flow])}>
        <Icon name={categoryIcons[operation.category]} className="size-4.5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate font-semibold text-zinc-950 dark:text-zinc-50">{operation.description}</h3>
          <AmountText operation={operation} />
        </div>
        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
          {formatDateNumeric(operation.date)} · {COMPTABILITE_CATEGORIES[operation.category].short} · {operation.bien}
          {operation.counterparty ? ` · ${operation.counterparty}` : ""}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <StatusBadge operation={operation} />
          <ComptabilitesRowMenu operation={operation} />
        </div>
      </div>
    </article>
  );
}
