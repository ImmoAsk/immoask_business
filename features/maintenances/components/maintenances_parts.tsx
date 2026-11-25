import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/utils/dates";
import type { ExportTable } from "@/lib/utils/export";
import { agoLabel, CATEGORY_LABELS } from "../hooks/maintenances_age";
import type { Maintenance, MaintenanceCategory } from "../types";
import { categoryIcons, maintenanceStatuses } from "./maintenances_styles";

// Small building blocks shared by the table, the mobile cards, the detail panel and the export.

/** Illustration of the category, standing in for the request's photo. */
export function CategoryTile({ category, className, iconClassName }: { category: MaintenanceCategory; className?: string; iconClassName?: string }) {
  return (
    <span
      role="img"
      aria-label={`Illustration ${CATEGORY_LABELS[category]}`}
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden bg-linear-to-br from-brand-400 to-brand-700 text-white dark:from-brand-500 dark:to-brand-800",
        className,
      )}
    >
      <span aria-hidden="true" className="absolute -top-[22%] -right-[18%] aspect-square w-[55%] rounded-full bg-white/18" />
      <Icon name={categoryIcons[category]} className={cn("relative", iconClassName)} strokeWidth={1.8} />
    </span>
  );
}

export function CategoryBadge({ category, className }: { category: MaintenanceCategory; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-brand-700 dark:bg-brand-900/60 dark:text-brand-100",
        className,
      )}
    >
      {CATEGORY_LABELS[category]}
    </span>
  );
}

export function StatusBadge({ maintenance, className }: { maintenance: Maintenance; className?: string }) {
  const status = maintenanceStatuses[maintenance.status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap", status.badge, className)}>
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", status.dot)} />
      {status.label}
    </span>
  );
}

/** Rows for the CSV / PDF export. */
export function maintenancesExportTable(maintenances: Maintenance[], asOf: string): ExportTable {
  return {
    title: "Maintenances ImmoAsk",
    header: ["N° maintenance", "Description", "Catégorie", "Propriété", "Date de création", "Ancienneté", "Statut"],
    rows: maintenances.map((maintenance) => [
      maintenance.reference,
      maintenance.description,
      CATEGORY_LABELS[maintenance.category],
      maintenance.property,
      formatShortDate(maintenance.createdAt),
      agoLabel(maintenance, asOf),
      maintenanceStatuses[maintenance.status].label,
    ]),
  };
}
