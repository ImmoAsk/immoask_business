"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { agoLabel, CATEGORY_LABELS, MAINTENANCE_STEPS, nextStatus } from "../hooks/maintenances_age";
import type { Maintenance } from "../types";
import { CategoryTile, StatusBadge } from "./maintenances_parts";
import { fieldLabel, maintenanceStatuses, maintenancesPanel } from "./maintenances_styles";

const LONG_DATE = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

const outline = cn(
  "inline-flex h-11 cursor-pointer items-center justify-center rounded-xl border border-zinc-300 bg-white px-2 text-center text-[13.5px] font-semibold whitespace-nowrap text-zinc-900 hover:border-brand-400 dark:border-white/15 dark:bg-transparent dark:text-zinc-100",
  focusRing,
);

export type MaintenancesDetailProps = {
  maintenance: Maintenance | null;
  asOf: string;
  /** Start work, or mark as resolved. */
  onAdvance: () => void;
  onAssign: () => void;
  className?: string;
};

/** The selected request: illustration, facts, progress and the next step. */
export function MaintenancesDetail({ maintenance, asOf, onAdvance, onAssign, className }: MaintenancesDetailProps) {
  if (!maintenance) {
    return (
      <aside className={cn(maintenancesPanel, "p-6 text-center text-sm text-zinc-500 dark:text-zinc-400", className)}>
        Sélectionnez une maintenance pour voir son détail.
      </aside>
    );
  }

  const done = nextStatus(maintenance.status) === null;
  const current = MAINTENANCE_STEPS.indexOf(maintenance.status);

  return (
    <aside aria-labelledby="maintenances-detail-title" className={cn(maintenancesPanel, "overflow-hidden", className)}>
      <div className="relative">
        <CategoryTile category={maintenance.category} className="h-48 w-full" iconClassName="size-22" />
        <span aria-hidden="true" className="absolute -bottom-16 -left-10 size-40 rounded-full bg-white/12" />
        <span className="absolute bottom-3.5 left-4 rounded-full bg-brand-950/45 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          {CATEGORY_LABELS[maintenance.category]}
        </span>
        <StatusBadge maintenance={maintenance} className="absolute top-4 right-4 bg-white! dark:bg-zinc-950!" />
      </div>

      <div className="flex flex-col gap-5 p-6">
        <div>
          <p className="text-xs font-bold tracking-[0.1em] text-brand-700 tabular-nums dark:text-brand-100">{maintenance.reference}</p>
          <h2 id="maintenances-detail-title" className="mt-1.5 text-[17px] leading-snug font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            {maintenance.description}
          </h2>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
          <div className="min-w-0">
            <dt className={fieldLabel}>Catégorie</dt>
            <dd className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{CATEGORY_LABELS[maintenance.category]}</dd>
          </div>
          <div className="min-w-0">
            <dt className={fieldLabel}>Date de création</dt>
            <dd className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{LONG_DATE.format(new Date(`${maintenance.createdAt}T00:00:00Z`))}</dd>
            <dd className="text-xs text-zinc-500 dark:text-zinc-400">{agoLabel(maintenance, asOf)}</dd>
          </div>
          <div className="col-span-2 min-w-0">
            <dt className={fieldLabel}>Propriété</dt>
            <dd className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{maintenance.property}</dd>
          </div>
        </dl>

        <div>
          <p id="maintenances-progress-label" className={cn(fieldLabel, "mb-2.5")}>
            Avancement
          </p>
          <ol aria-labelledby="maintenances-progress-label" className="flex">
            {MAINTENANCE_STEPS.map((step, index) => {
              const reached = index <= current;
              const checked = index < current || done;
              return (
                <li key={step} aria-current={index === current ? "step" : undefined} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="flex w-full items-center">
                    <span className={cn("h-0.75 flex-1", index === 0 ? "bg-transparent" : reached ? "bg-brand-600 dark:bg-brand-400" : "bg-zinc-200 dark:bg-white/10")} />
                    <span
                      className={cn(
                        "grid size-7 shrink-0 place-items-center rounded-full border-2 text-xs font-bold",
                        reached
                          ? "border-brand-600 bg-brand-600 text-white dark:border-brand-400 dark:bg-brand-400 dark:text-brand-950"
                          : "border-zinc-300 bg-white text-zinc-500 dark:border-white/20 dark:bg-zinc-950 dark:text-zinc-400",
                      )}
                    >
                      {checked ? <Icon name="check" className="size-3.5" strokeWidth={3} /> : index + 1}
                    </span>
                    <span
                      className={cn(
                        "h-0.75 flex-1",
                        index === MAINTENANCE_STEPS.length - 1 ? "bg-transparent" : index < current ? "bg-brand-600 dark:bg-brand-400" : "bg-zinc-200 dark:bg-white/10",
                      )}
                    />
                  </span>
                  <span className={cn("text-center text-xs", index === current ? "font-bold text-zinc-950 dark:text-zinc-50" : "font-semibold text-zinc-500 dark:text-zinc-400")}>
                    {maintenanceStatuses[step].step}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onAdvance}
            disabled={done}
            className={cn(
              "inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-br from-brand-500 to-brand-700 text-sm font-bold text-white shadow-[0_8px_18px_-6px_rgba(10,116,174,0.6)] hover:from-brand-600 hover:to-brand-800 disabled:cursor-not-allowed disabled:opacity-45",
              focusRing,
            )}
          >
            <Icon name={done ? "checkCircle" : maintenance.status === "nouvelle" ? "wrench" : "badgeCheck"} className="size-4.5" strokeWidth={2.2} />
            {maintenanceStatuses[maintenance.status].action}
          </button>
          <div className="grid grid-cols-2 gap-2.5">
            <button type="button" onClick={onAssign} disabled={done} className={cn(outline, "disabled:cursor-not-allowed disabled:opacity-45")}>
              Assigner un prestataire
            </button>
            <Link href="/app/portofolio" className={outline}>
              Voir la propriété
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
