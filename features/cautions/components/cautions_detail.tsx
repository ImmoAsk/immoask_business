"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { printPdf } from "@/lib/utils/export";
import { formatAmount, formatCompactAmount } from "@/lib/utils/format";
import { cautionStatus, remainingAmount, remainingPercent, usedAmount } from "../hooks/cautions_balance";
import type { Caution } from "../types";
import { cautionStatement, fcfa, modeLongText, StatusBadge } from "./cautions_parts";
import { cautionStatuses, cautionsPanel, fieldLabel } from "./cautions_styles";

const LONG_DATE = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const longDate = (iso: string) => LONG_DATE.format(new Date(`${iso}T00:00:00Z`));

const outline = cn(
  "inline-flex h-11 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-zinc-300 bg-white px-2 text-center text-[13.5px] font-semibold whitespace-nowrap text-zinc-900 hover:border-brand-400 dark:border-white/15 dark:bg-transparent dark:text-zinc-100",
  focusRing,
);

/** Radius of the level ring. */
const RING_RADIUS = 52;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

export type CautionsDetailProps = {
  caution: Caution | null;
  /** Records the tenant refilling the deposit. */
  onReconstitute: () => void;
  className?: string;
};

/** The selected deposit: level, amounts, facts and the history of the vault. */
export function CautionsDetail({ caution, onReconstitute, className }: CautionsDetailProps) {
  if (!caution) {
    return (
      <aside className={cn(cautionsPanel, "p-6 text-center text-sm text-zinc-500 dark:text-zinc-400", className)}>
        Sélectionnez une caution pour voir son détail.
      </aside>
    );
  }

  const status = cautionStatus(caution);
  const used = usedAmount(caution);
  const percent = Math.round(remainingPercent(caution));
  const movements = [
    { id: "depot", kind: "depot" as const, date: caution.depositedAt, label: "Dépôt de la caution", amount: caution.amount },
    ...caution.movements,
  ];
  const facts: [string, string][] = [
    ["Date de dépôt", longDate(caution.depositedAt)],
    ["Locataire", caution.agreement.tenant],
    ["Caution définie en", modeLongText(caution)],
  ];

  return (
    <aside aria-labelledby="cautions-detail-title" className={cn(cautionsPanel, "overflow-hidden", className)}>
      <header className="relative flex flex-wrap items-center gap-5 overflow-hidden bg-linear-to-br from-brand-950 via-brand-900 to-brand-700 p-6 text-white">
        <span aria-hidden="true" className="absolute -top-16 -right-12 size-48 rounded-full bg-brand-400/25 blur-2xl" />
        <div className="relative size-[132px] shrink-0">
          <svg viewBox="0 0 132 132" aria-hidden="true" className="size-full -rotate-90">
            <circle cx="66" cy="66" r={RING_RADIUS} fill="none" stroke="currentColor" strokeWidth="12" className="text-white/15" />
            <circle
              cx="66"
              cy="66"
              r={RING_RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${((RING_LENGTH * percent) / 100).toFixed(1)} ${RING_LENGTH.toFixed(1)}`}
              className={cautionStatuses[status].ring}
            />
          </svg>
          <span className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[26px] font-bold tracking-tight tabular-nums">{percent} %</span>
            <span className="text-[11px] font-semibold text-brand-200">restant</span>
          </span>
        </div>
        <div className="relative min-w-0 flex-1 basis-36">
          <p className="text-xs font-bold tracking-[0.1em] text-brand-200 tabular-nums">{caution.reference}</p>
          <p className="mt-2.5 text-[13px] text-brand-100">Caution restante</p>
          <h2 id="cautions-detail-title" className="mt-0.5 text-2xl font-bold tracking-tight tabular-nums">
            {fcfa(remainingAmount(caution))}
          </h2>
          <StatusBadge
            caution={caution}
            className={cn("mt-3 bg-white! dark:bg-white!", status === "modifiee" ? "text-orange-700! dark:text-orange-700!" : "text-brand-700! dark:text-brand-700!")}
          />
        </div>
      </header>

      <div className="flex flex-col gap-5 p-6">
        <dl className="grid grid-cols-3 gap-2.5">
          <div className="rounded-xl bg-zinc-100 px-3 py-2.5 dark:bg-white/5">
            <dt className={cn(fieldLabel, "text-[10px]")}>Déposée</dt>
            <dd className="mt-1 text-[13.5px] font-bold text-zinc-950 tabular-nums dark:text-zinc-50">{formatCompactAmount(caution.amount)}</dd>
          </div>
          <div className={cn("rounded-xl px-3 py-2.5", used > 0 ? "bg-orange-50 dark:bg-orange-950/60" : "bg-zinc-100 dark:bg-white/5")}>
            <dt className={cn(fieldLabel, "text-[10px]", used > 0 && "text-orange-700 dark:text-orange-300")}>Utilisée</dt>
            <dd className={cn("mt-1 text-[13.5px] font-bold tabular-nums", used > 0 ? "text-orange-700 dark:text-orange-300" : "text-zinc-950 dark:text-zinc-50")}>
              {used > 0 ? formatCompactAmount(used) : "0"}
            </dd>
          </div>
          <div className="rounded-xl bg-brand-50 px-3 py-2.5 dark:bg-brand-900/40">
            <dt className={cn(fieldLabel, "text-[10px] text-brand-700 dark:text-brand-100")}>Restante</dt>
            <dd className="mt-1 text-[13.5px] font-bold text-brand-700 tabular-nums dark:text-brand-100">{formatCompactAmount(remainingAmount(caution))}</dd>
          </div>
        </dl>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
          <div className="min-w-0">
            <dt className={fieldLabel}>Contrat de location</dt>
            <dd className="mt-1 text-sm font-bold text-brand-700 tabular-nums dark:text-brand-100">{caution.agreement.reference}</dd>
          </div>
          {facts.map(([term, value]) => (
            <div key={term} className="min-w-0">
              <dt className={fieldLabel}>{term}</dt>
              <dd className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{value}</dd>
            </div>
          ))}
          <div className="col-span-2 min-w-0">
            <dt className={fieldLabel}>Propriété</dt>
            <dd className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{caution.agreement.property}</dd>
          </div>
        </dl>

        <div>
          <p id="cautions-moves-label" className={cn(fieldLabel, "mb-3")}>
            Mouvements du coffre
          </p>
          <ol aria-labelledby="cautions-moves-label" className="flex flex-col">
            {movements.map((movement, index) => {
              const out = movement.kind === "prelevement";
              return (
                <li key={movement.id} className="flex gap-3.5">
                  <span className="flex flex-col items-center">
                    <span
                      className={cn(
                        "grid size-7 shrink-0 place-items-center rounded-full",
                        out ? "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300" : "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100",
                      )}
                    >
                      <Icon name={out ? "arrowDown" : "arrowUp"} className="size-3.5" strokeWidth={2.6} />
                    </span>
                    {index < movements.length - 1 ? <span aria-hidden="true" className="min-h-3.5 w-0.5 flex-1 bg-zinc-200 dark:bg-white/10" /> : null}
                  </span>
                  <span className="flex min-w-0 flex-1 justify-between gap-2.5 pb-3.5">
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-zinc-900 dark:text-zinc-100">{movement.label}</span>
                      <span className="block text-xs text-zinc-500 dark:text-zinc-400">{longDate(movement.date)}</span>
                    </span>
                    <span
                      className={cn(
                        "text-sm font-bold whitespace-nowrap tabular-nums",
                        out ? "text-orange-700 dark:text-orange-300" : "text-brand-700 dark:text-brand-100",
                      )}
                    >
                      {out ? "−" : "+"} {formatAmount(movement.amount)}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onReconstitute}
            disabled={used <= 0}
            className={cn(
              "inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-br from-brand-500 to-brand-700 text-sm font-bold text-white shadow-[0_8px_18px_-6px_rgba(10,116,174,0.6)] hover:from-brand-600 hover:to-brand-800 disabled:cursor-not-allowed disabled:opacity-45",
              focusRing,
            )}
          >
            <Icon name={used > 0 ? "reset" : "shield"} className="size-4.5" strokeWidth={2.2} />
            {used > 0 ? `Reconstituer ${fcfa(used)}` : "Caution intacte"}
          </button>
          <div className="grid grid-cols-2 gap-2.5">
            <Link href="/app/contrats-location" className={outline}>
              Voir le contrat
            </Link>
            <button type="button" onClick={() => printPdf(cautionStatement(caution))} className={outline}>
              <Icon name="file" className="size-4 text-brand-600 dark:text-brand-100" />
              Relevé PDF
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
