import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/utils/dates";
import type { ExportTable } from "@/lib/utils/export";
import { formatAmount } from "@/lib/utils/format";
import { CONDITION_LABELS, KIND_LABELS, TYPE_LABELS } from "../hooks/etat_lieux_items";
import type { InventoryLine, InventoryType, ItemCondition, ItemKind } from "../types";
import { conditionStyles, kindIcons, photoVariants, typeStyles } from "./etat_lieux_styles";

// Small building blocks shared by the table, the mobile cards, the detail panel and the exports.

export const costText = (cost: number | null) => (cost === null ? "—" : `${formatAmount(cost)} FCFA`);

export const photosText = (count: number) => `${count} photo${count > 1 ? "s" : ""}`;

/** Stand-in for an item photo: its kind's icon on a blue tile. */
export function KindTile({
  kind,
  variant = 0,
  className,
  iconClassName,
  children,
}: {
  kind: ItemKind;
  variant?: number;
  className?: string;
  iconClassName?: string;
  children?: React.ReactNode;
}) {
  const look = photoVariants[variant % photoVariants.length];
  return (
    <span className={cn("relative grid shrink-0 place-items-center overflow-hidden bg-linear-to-br text-white", look.tile, className)}>
      <span aria-hidden="true" className={cn("absolute aspect-square w-[55%] rounded-full bg-white/16", look.one)} />
      <span aria-hidden="true" className={cn("absolute aspect-square w-[48%] rounded-full bg-white/10", look.two)} />
      <Icon name={kindIcons[kind]} className={cn("relative", iconClassName)} strokeWidth={1.7} />
      {children}
    </span>
  );
}

export function ConditionBadge({ condition, className }: { condition: ItemCondition; className?: string }) {
  const style = conditionStyles[condition];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap", style.badge, className)}>
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", style.dot)} />
      {CONDITION_LABELS[condition]}
    </span>
  );
}

export function TypeBadge({ type, className }: { type: InventoryType; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap", typeStyles[type], className)}>
      <Icon name={type === "entree" ? "arrowRight" : "chevronLeft"} className="size-3" strokeWidth={2.6} />
      {TYPE_LABELS[type]}
    </span>
  );
}

/** Rows for the CSV / PDF export of the list. */
export function etatLieuxExportTable(lines: InventoryLine[]): ExportTable {
  return {
    title: "Inventaires ImmoAsk",
    header: ["N° inventaire", "Type", "Date", "Propriété", "Locataire", "Gestionnaire", "Élément", "Pièce", "Nature", "État", "Coût (FCFA)", "Photos"],
    rows: lines.map((line) => [
      line.inventory.reference,
      TYPE_LABELS[line.inventory.type],
      formatShortDate(line.inventory.date),
      line.inventory.property,
      line.inventory.tenant,
      line.inventory.manager,
      line.element,
      line.room,
      KIND_LABELS[line.kind],
      CONDITION_LABELS[line.condition],
      line.cost ?? "",
      line.photos,
    ]),
  };
}

/** "Fiche PDF": every item of the inventory the line belongs to. */
export function inventorySheet(line: InventoryLine, lines: InventoryLine[]): ExportTable {
  const { reference, type, date, property, tenant, manager } = line.inventory;
  const items = lines.filter((other) => other.inventory.reference === reference);
  return {
    title: `Inventaire ${reference} · ${TYPE_LABELS[type]}`,
    header: ["Élément", "Pièce", "Nature", "État", "Coût (FCFA)", "Photos"],
    rows: items.map((item) => [item.element, item.room, KIND_LABELS[item.kind], CONDITION_LABELS[item.condition], item.cost ?? "—", item.photos]),
    footer: `${property} · Locataire : ${tenant} · Gestionnaire : ${manager} · ${formatShortDate(date)}`,
  };
}
