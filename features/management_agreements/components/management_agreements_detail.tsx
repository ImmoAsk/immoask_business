"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/utils/dates";
import { formatAmount } from "@/lib/utils/format";
import { monthlyCommission } from "../hooks/management_agreements_money";
import type { ManagementAgreement } from "../types";
import { maskIban, ownerInitials, remunerationDetail, StatusBadge } from "./management_agreements_parts";
import { fieldLabel, managementPanel, terminationReasons } from "./management_agreements_styles";

export type ManagementAgreementsDetailProps = {
  agreement: ManagementAgreement | null;
  onAssign: () => void;
  onTerminate: () => void;
  className?: string;
};

/** The selected contract: parties, remuneration, payout account, properties and actions. */
export function ManagementAgreementsDetail({ agreement, onAssign, onTerminate, className }: ManagementAgreementsDetailProps) {
  const [ibanShownFor, setIbanShownFor] = useState<string | null>(null);

  if (!agreement) {
    return (
      <aside className={cn(managementPanel, "p-6 text-center text-sm text-zinc-500 dark:text-zinc-400", className)}>
        Sélectionnez un contrat pour voir son détail.
      </aside>
    );
  }

  // The IBAN is masked again whenever another contract is selected.
  const ibanShown = ibanShownFor === agreement.id;
  const remuneration = remunerationDetail(agreement.remuneration);
  const locked = agreement.status === "resilie";
  const facts: [string, string, boolean?][] = [
    ["Propriétaire", agreement.owner.name],
    ["Gestionnaire", agreement.manager],
    ["Mode de rémunération", remuneration.mode],
    [remuneration.label, remuneration.value, true],
    ["Date de signature", formatShortDate(agreement.signedAt)],
    ["Date de début", formatShortDate(agreement.startDate)],
  ];

  return (
    <aside aria-labelledby="management-detail-title" className={cn(managementPanel, "overflow-hidden", className)}>
      <header className="flex flex-col gap-3 bg-linear-to-br from-brand-950 via-brand-900 to-brand-700 px-6 pt-5 pb-5 text-white">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-bold tracking-[0.12em] text-brand-200">CONTRAT DE GESTION</span>
          <StatusBadge agreement={agreement} className="ring-1 ring-white/20" />
        </div>
        <div className="flex items-center gap-3.5">
          <span
            aria-hidden="true"
            className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-white/35 bg-linear-to-br from-brand-400 to-brand-600 text-[15px] font-bold"
          >
            {ownerInitials(agreement.owner.name)}
          </span>
          <div className="min-w-0">
            <h2 id="management-detail-title" className="text-lg leading-snug font-bold tracking-tight">
              {agreement.label}
            </h2>
            <p className="mt-0.5 truncate text-[13px] text-brand-100">{agreement.owner.name}</p>
          </div>
        </div>
        <p className="text-[13px] leading-relaxed text-brand-100">{agreement.building}</p>
      </header>

      <div className="flex flex-col gap-5 p-6">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
          {facts.map(([term, value, highlight]) => (
            <div key={term} className="min-w-0">
              <dt className={fieldLabel}>{term}</dt>
              <dd
                className={cn(
                  "mt-1 text-sm font-semibold",
                  highlight ? "font-bold text-brand-700 tabular-nums dark:text-brand-100" : "text-zinc-900 dark:text-zinc-100",
                )}
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-brand-100 bg-brand-50/70 px-4 py-3.5 dark:border-brand-800/60 dark:bg-brand-900/30">
          <div>
            <p className={cn(fieldLabel, "text-brand-800 dark:text-brand-100")}>Commission mensuelle estimée</p>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">sur {formatAmount(agreement.monthlyRents)} FCFA de loyers</p>
          </div>
          <p className="text-xl font-bold whitespace-nowrap text-brand-800 tabular-nums dark:text-brand-100">
            {formatAmount(monthlyCommission(agreement))} <span className="text-xs font-semibold">FCFA</span>
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center justify-between gap-3">
            <span className={fieldLabel}>IBAN de versement</span>
            <button
              type="button"
              aria-pressed={ibanShown}
              onClick={() => setIbanShownFor(ibanShown ? null : agreement.id)}
              className={cn("h-8 cursor-pointer rounded-lg px-2 text-[13px] font-bold text-brand-700 hover:bg-brand-50 dark:text-brand-100 dark:hover:bg-brand-900/40", focusRing)}
            >
              {ibanShown ? "Masquer" : "Afficher"}
            </button>
          </div>
          <p className="mt-1 font-mono text-sm font-semibold tracking-wide break-all text-zinc-900 dark:text-zinc-100">
            {!agreement.payout.iban ? "—" : ibanShown ? agreement.payout.iban : maskIban(agreement.payout.iban)}
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{agreement.payout.bank}</p>
        </div>

        <div>
          <p className={fieldLabel}>Description de l&apos;immeuble</p>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{agreement.description}</p>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-zinc-100 pt-4 dark:border-white/10">
          <span className={fieldLabel}>Biens affectés</span>
          <span className="text-[22px] font-bold text-zinc-950 tabular-nums dark:text-zinc-50">{agreement.biensCount}</span>
        </div>
        {agreement.assigned.length > 0 ? (
          <ul className="-mt-2 flex flex-wrap gap-1.5" aria-label="Biens affectés à l'instant">
            {agreement.assigned.map((bien) => (
              <li key={bien.id} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800 dark:bg-brand-900/60 dark:text-brand-100">
                {bien.label}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onAssign}
            disabled={locked}
            className={cn(
              "inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-br from-brand-500 to-brand-700 text-sm font-bold text-white shadow-[0_8px_18px_-6px_rgba(10,116,174,0.6)] hover:from-brand-600 hover:to-brand-800 disabled:cursor-not-allowed disabled:opacity-45",
              focusRing,
            )}
          >
            <Icon name="plus" className="size-4.5" strokeWidth={2.2} />
            Affecter un bien immobilier
          </button>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              className={cn(
                "h-11 cursor-pointer rounded-xl border border-zinc-300 bg-white text-sm font-semibold text-zinc-900 hover:border-brand-400 dark:border-white/15 dark:bg-transparent dark:text-zinc-100",
                focusRing,
              )}
            >
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
          {locked && agreement.termination ? (
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Ce contrat est résilié : les actions sont désactivées. Résilié le {formatShortDate(agreement.termination.date)} ·{" "}
              {terminationReasons[agreement.termination.reason]}.
            </p>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
