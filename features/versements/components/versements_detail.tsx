"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/utils/dates";
import { printPdf } from "@/lib/utils/export";
import { formatAmount } from "@/lib/utils/format";
import { agoLabel, fileSize, METHOD_LABELS } from "../hooks/versements_labels";
import type { Versement } from "../types";
import { FileTile, TypeBadge, versementReceipt } from "./versements_parts";
import { fieldLabel, versementsPanel } from "./versements_styles";

const LONG_DATE = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

const outline = cn(
  "inline-flex h-11 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-zinc-300 bg-white px-2 text-center text-[13.5px] font-semibold whitespace-nowrap text-zinc-900 hover:border-brand-400 dark:border-white/15 dark:bg-transparent dark:text-zinc-100",
  focusRing,
);

/** Half-circle cut into the panel edge, in the page background colour. */
const notch = "absolute -top-3.5 size-[26px] rounded-full border border-zinc-100 bg-zinc-50 dark:border-white/10 dark:bg-zinc-900";

export type VersementsDetailProps = {
  versement: Versement | null;
  asOf: string;
  onDownload: () => void;
  className?: string;
};

/** The selected payout, laid out as a receipt. */
export function VersementsDetail({ versement, asOf, onDownload, className }: VersementsDetailProps) {
  if (!versement) {
    return (
      <aside className={cn(versementsPanel, "p-6 text-center text-sm text-zinc-500 dark:text-zinc-400", className)}>
        Sélectionnez un versement pour voir son détail.
      </aside>
    );
  }

  const facts: [string, string, string?][] = [
    ["Propriétaire", versement.management.owner],
    ["Gestionnaire", versement.management.manager],
    ["Date du dépôt", LONG_DATE.format(new Date(`${versement.date}T00:00:00Z`)), agoLabel(versement.date, asOf)],
    ["Moyen de versement", METHOD_LABELS[versement.method], versement.account],
  ];

  return (
    <aside aria-labelledby="versements-detail-title" className={cn(versementsPanel, "overflow-hidden", className)}>
      <header className="relative overflow-hidden bg-linear-to-br from-brand-950 via-brand-900 to-brand-700 px-6 pt-6 pb-7 text-white">
        <span aria-hidden="true" className="absolute -top-16 -right-12 size-48 rounded-full bg-brand-400/25 blur-2xl" />
        <div className="relative flex items-center justify-between gap-3">
          <span className="text-xs font-bold tracking-[0.1em] text-brand-200 tabular-nums">{versement.reference}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-bold">
            <Icon name="check" className="size-3.5" strokeWidth={3} />
            Versement reçu
          </span>
        </div>
        <p className="relative mt-4 text-[13px] font-medium text-brand-100">Montant versé</p>
        <h2 id="versements-detail-title" className="relative mt-1 flex flex-wrap items-baseline gap-2.5">
          <span className="text-[38px] leading-none font-bold tracking-tight tabular-nums">{formatAmount(versement.amount)}</span>
          <span className="text-[17px] font-bold text-brand-200">{versement.currency}</span>
        </h2>
        <TypeBadge type={versement.type} className="relative mt-3.5 bg-white! text-brand-800! ring-0! dark:bg-white! dark:text-brand-800!" />
      </header>

      <div aria-hidden="true" className="relative mx-[18px] border-t-2 border-dashed border-zinc-200 dark:border-white/15">
        <span className={cn(notch, "-left-[31px]")} />
        <span className={cn(notch, "-right-[31px]")} />
      </div>

      <div className="flex flex-col gap-5 p-6">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
          <div className="col-span-2 min-w-0">
            <dt className={fieldLabel}>Contrat de gestion</dt>
            <dd className="mt-1 text-sm font-bold text-brand-700 tabular-nums dark:text-brand-100">{versement.management.reference}</dd>
            <dd className="text-[13px] text-zinc-500 dark:text-zinc-400">{versement.management.property}</dd>
          </div>
          {facts.map(([term, value, sub]) => (
            <div key={term} className="min-w-0">
              <dt className={fieldLabel}>{term}</dt>
              <dd className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{value}</dd>
              {sub ? <dd className="text-xs text-zinc-500 tabular-nums dark:text-zinc-400">{sub}</dd> : null}
            </div>
          ))}
          <div className="col-span-2 min-w-0">
            <dt className={fieldLabel}>Référence de transaction</dt>
            <dd className="mt-1 text-sm font-semibold text-zinc-900 tabular-nums dark:text-zinc-100">{versement.transactionRef}</dd>
          </div>
        </dl>

        <div>
          <p className={cn(fieldLabel, "mb-2.5")}>Pièce jointe</p>
          <div className="flex items-center gap-3.5 rounded-2xl border border-zinc-200 bg-zinc-50 px-3.5 py-3 dark:border-white/10 dark:bg-white/5">
            <FileTile name={versement.attachment.name} large />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-zinc-900 dark:text-zinc-100" title={versement.attachment.name}>
                {versement.attachment.name}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                {fileSize(versement.attachment.size)} · ajouté le {formatShortDate(versement.date)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onDownload}
            className={cn(
              "inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-br from-brand-500 to-brand-700 text-sm font-bold text-white shadow-[0_8px_18px_-6px_rgba(10,116,174,0.6)] hover:from-brand-600 hover:to-brand-800",
              focusRing,
            )}
          >
            <Icon name="download" className="size-4.5" strokeWidth={2.2} />
            Télécharger la pièce jointe
          </button>
          <div className="grid grid-cols-2 gap-2.5">
            <Link href="/app/contrats-gestion" className={outline}>
              Voir le contrat
            </Link>
            <button type="button" onClick={() => printPdf(versementReceipt(versement))} className={outline}>
              <Icon name="file" className="size-4 text-brand-600 dark:text-brand-100" />
              Reçu PDF
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
