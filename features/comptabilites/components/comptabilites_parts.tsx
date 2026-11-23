import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatAmount } from "@/lib/utils/format";
import { COMPTABILITE_CATEGORIES } from "../hooks/comptabilites_categories";
import type { ComptabiliteOperation } from "../types";
import { categoryIcons, flowTiles, statusStyle } from "./comptabilites_styles";

// Small building blocks shared by the table, the mobile cards and the exports.

const MONTHS = ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."];
const MONTHS_LONG = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

/** "2026-11-12" → "12/11/2026" */
export function formatDateNumeric(isoDate: string) {
  return isoDate.split("-").reverse().join("/");
}

/** "2026-07" → "Juil." */
export function monthShort(isoMonth: string) {
  return MONTHS[Number(isoMonth.slice(5, 7)) - 1];
}

/** "2026-07" → "juillet 2026" */
export function monthLong(isoMonth: string) {
  return `${MONTHS_LONG[Number(isoMonth.slice(5, 7)) - 1]} ${isoMonth.slice(0, 4)}`;
}

/** "+650 000" / "−180 000" */
export function signedAmount(operation: ComptabiliteOperation) {
  return `${operation.flow === "recette" ? "+" : "−"}${formatAmount(operation.amount)}`;
}

export function CategoryCell({ operation }: { operation: ComptabiliteOperation }) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <span className={cn("grid size-8 shrink-0 place-items-center rounded-xl", flowTiles[operation.flow])}>
        <Icon name={categoryIcons[operation.category]} className="size-4" />
      </span>
      <span className="truncate font-medium text-zinc-800 dark:text-zinc-200">
        {COMPTABILITE_CATEGORIES[operation.category].short}
      </span>
    </span>
  );
}

export function AmountText({ operation, className }: { operation: ComptabiliteOperation; className?: string }) {
  return (
    <span
      className={cn(
        "font-semibold whitespace-nowrap tabular-nums",
        operation.flow === "recette" ? "text-brand-700 dark:text-brand-100" : "text-zinc-900 dark:text-zinc-100",
        className,
      )}
    >
      {signedAmount(operation)}
    </span>
  );
}

export function StatusBadge({ operation }: { operation: ComptabiliteOperation }) {
  const style = statusStyle(operation.status, operation.flow);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-semibold whitespace-nowrap",
        style.badge,
      )}
    >
      <Icon name={style.icon} className="size-3.5" strokeWidth={2.2} />
      {style.label}
    </span>
  );
}
