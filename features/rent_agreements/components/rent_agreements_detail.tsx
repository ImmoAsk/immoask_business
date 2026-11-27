"use client";

import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/utils/dates";
import { printPdf } from "@/lib/utils/export";
import { agreementStatus, stayNights } from "../hooks/rent_agreements_status";
import type { RentAgreement } from "../types";
import { amountText, contractSheet, depositText, StatusBadge, tenantInitials, TypeBadge } from "./rent_agreements_parts";
import { fieldLabel, rentPanel, terminationReasons } from "./rent_agreements_styles";

const outline = cn(
  "h-11 cursor-pointer rounded-xl border border-zinc-300 bg-white text-sm font-semibold text-zinc-900 hover:border-brand-400 dark:border-white/15 dark:bg-transparent dark:text-zinc-100",
  focusRing,
);

export type RentAgreementsDetailProps = {
  agreement: RentAgreement | null;
  asOf: string;
  onTerminate: () => void;
  className?: string;
};

/** The selected lease: its management agreement, property, tenant, amounts, deposit and actions. */
export function RentAgreementsDetail({ agreement, asOf, onTerminate, className }: RentAgreementsDetailProps) {
  if (!agreement) {
    return (
      <aside className={cn(rentPanel, "p-6 text-center text-sm text-zinc-500 dark:text-zinc-400", className)}>
        Sélectionnez une location pour voir son détail.
      </aside>
    );
  }

  const status = agreementStatus(agreement, asOf);
  const locked = status === "termine" || status === "resilie";
  const amount = amountText(agreement);
  const deposit = depositText(agreement);
  const lockedNote =
    status === "termine"
      ? "Ce séjour est terminé : la résiliation n'est plus possible."
      : agreement.termination
        ? `Ce contrat est résilié le ${formatShortDate(agreement.termination.date)} · ${terminationReasons[agreement.termination.reason]}.`
        : "";

  return (
    <aside aria-labelledby="rent-detail-title" className={cn(rentPanel, "overflow-hidden", className)}>
      <header className="flex flex-col gap-3 bg-linear-to-br from-brand-950 via-brand-900 to-brand-700 px-6 pt-5 pb-5 text-white">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-bold tracking-[0.12em] text-brand-200">CONTRAT DE LOCATION</span>
          <StatusBadge agreement={agreement} asOf={asOf} className="ring-1 ring-white/20" />
        </div>
        <div className="flex items-center gap-3.5">
          <span
            aria-hidden="true"
            className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-white/35 bg-linear-to-br from-brand-400 to-brand-600 text-[15px] font-bold"
          >
            {tenantInitials(agreement.tenant)}
          </span>
          <div className="min-w-0">
            <h2 id="rent-detail-title" className="text-[22px] leading-tight font-bold tracking-tight tabular-nums">
              {agreement.reference}
            </h2>
            <p className="mt-0.5 truncate text-[13px] text-brand-100">{agreement.tenant}</p>
          </div>
        </div>
        <p className="text-[13px] leading-relaxed text-brand-100">{agreement.property}</p>
      </header>

      <div className="flex flex-col gap-5 p-6">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
          <div className="min-w-0">
            <dt className={fieldLabel}>Contrat de gestion</dt>
            <dd className="mt-1 text-sm leading-snug font-bold text-brand-700 dark:text-brand-100">{agreement.management.label}</dd>
          </div>
          <div className="min-w-0">
            <dt className={fieldLabel}>Propriété</dt>
            <dd className="mt-1 text-sm leading-snug font-semibold text-zinc-900 dark:text-zinc-100">{agreement.property}</dd>
          </div>
          <div className="min-w-0">
            <dt className={fieldLabel}>Type de contrat</dt>
            <dd className="mt-1">
              <TypeBadge agreement={agreement} />
            </dd>
          </div>
          <div className="min-w-0">
            <dt className={fieldLabel}>Locataire</dt>
            <dd className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{agreement.tenant}</dd>
          </div>
          <div className="min-w-0">
            <dt className={fieldLabel}>Montant final</dt>
            <dd className="mt-1 text-[15px] font-bold text-brand-700 tabular-nums dark:text-brand-100">{amount.value}</dd>
            <dd className="text-xs text-zinc-500 dark:text-zinc-400">{amount.sub}</dd>
          </div>
          <div className="min-w-0">
            <dt className={fieldLabel}>Date de début</dt>
            <dd className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{formatShortDate(agreement.startDate)}</dd>
          </div>
          {agreement.endDate ? (
            <div className="col-span-2">
              <dt className={fieldLabel}>Date de fin</dt>
              <dd className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {formatShortDate(agreement.endDate)} · {stayNights(agreement)} nuits
              </dd>
            </div>
          ) : null}
        </dl>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-brand-100 bg-brand-50/70 px-4 py-3.5 dark:border-brand-800/60 dark:bg-brand-900/30">
          <div>
            <p className={cn(fieldLabel, "text-brand-800 dark:text-brand-100")}>Caution</p>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{deposit.label}</p>
          </div>
          <p className="text-xl font-bold whitespace-nowrap text-brand-800 tabular-nums dark:text-brand-100">{deposit.value}</p>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => printPdf(contractSheet(agreement, asOf))}
            className={cn(outline, "inline-flex h-12 items-center justify-center gap-2")}
          >
            <Icon name="file" className="size-4.5 text-brand-600 dark:text-brand-100" />
            Télécharger le contrat
          </button>
          <div className="grid grid-cols-2 gap-2.5">
            <button type="button" className={outline}>
              Modifier
            </button>
            <button
              type="button"
              onClick={onTerminate}
              disabled={locked}
              className={cn(
                "h-11 cursor-pointer rounded-xl border border-red-400 bg-white text-sm font-bold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-45 dark:border-red-800 dark:bg-transparent dark:text-red-300 dark:hover:bg-red-950/40",
                focusRing,
              )}
            >
              Résilier le contrat
            </button>
          </div>
          {locked ? <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{lockedNote}</p> : null}
        </div>
      </div>
    </aside>
  );
}
