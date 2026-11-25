import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/utils/dates";
import type { ExportTable } from "@/lib/utils/export";
import { formatAmount } from "@/lib/utils/format";
import { cautionStatus, monthSegments, remainingAmount, remainingPercent, usedAmount } from "../hooks/cautions_balance";
import type { Caution } from "../types";
import { cautionStatuses, modeStyles } from "./cautions_styles";

// Small building blocks shared by the table, the mobile cards, the detail panel and the exports.

export const fcfa = (value: number) => `${formatAmount(value)} FCFA`;

/** "2 mois de loyer" or "Montant fixe" */
export const modeText = (caution: Caution) => (caution.mode === "mois" ? `${caution.months ?? monthSegments(caution)} mois de loyer` : "Montant fixe");

/** "2 mois de loyer (150 000 FCFA/mois)" */
export const modeLongText = (caution: Caution) =>
  caution.mode === "mois" ? `${modeText(caution)} (${formatAmount(caution.agreement.monthlyRent)} FCFA/mois)` : "Montant fixe";

export function StatusBadge({ caution, className }: { caution: Caution; className?: string }) {
  const status = cautionStatuses[cautionStatus(caution)];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap", status.badge, className)}>
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", status.dot)} />
      {status.label}
    </span>
  );
}

export function ModeBadge({ caution, className }: { caution: Caution; className?: string }) {
  return <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11.5px] font-semibold whitespace-nowrap", modeStyles[caution.mode], className)}>{modeText(caution)}</span>;
}

/** What is left in the deposit, split into months of rent. */
export function VaultBar({ caution, className }: { caution: Caution; className?: string }) {
  const percent = Math.round(remainingPercent(caution));
  const segments = monthSegments(caution);
  return (
    <span className={cn("block min-w-0", className)}>
      <span className="mb-1.5 flex justify-between gap-2 text-xs tabular-nums">
        <span className="truncate font-bold text-zinc-900 dark:text-zinc-100">{fcfa(remainingAmount(caution))}</span>
        <span className="text-zinc-500 dark:text-zinc-400">{percent} %</span>
      </span>
      <span
        role="progressbar"
        aria-label={`Caution restante : ${percent} %, sur ${segments} mois de loyer`}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="relative block h-2.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10"
      >
        <span className={cn("absolute inset-y-0 left-0 rounded-full", cautionStatuses[cautionStatus(caution)].fill)} style={{ width: `${percent}%` }} />
        {Array.from({ length: segments - 1 }, (_, index) => (
          <span
            key={index}
            aria-hidden="true"
            className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white dark:bg-zinc-950"
            style={{ left: `${((index + 1) / segments) * 100}%` }}
          />
        ))}
      </span>
    </span>
  );
}

/** Rows for the CSV / PDF export of the list. */
export function cautionsExportTable(cautions: Caution[]): ExportTable {
  return {
    title: "Cautions ImmoAsk",
    header: ["N° caution", "Contrat de location", "Locataire", "Propriété", "Définie en", "Déposée (FCFA)", "Utilisée (FCFA)", "Restante (FCFA)", "Date de dépôt", "Statut"],
    rows: cautions.map((caution) => [
      caution.reference,
      caution.agreement.reference,
      caution.agreement.tenant,
      caution.agreement.property,
      modeText(caution),
      caution.amount,
      usedAmount(caution),
      remainingAmount(caution),
      formatShortDate(caution.depositedAt),
      cautionStatuses[cautionStatus(caution)].label,
    ]),
  };
}

/** "Relevé PDF": the deposit and every movement. */
export function cautionStatement(caution: Caution): ExportTable {
  return {
    title: `Relevé de caution ${caution.reference}`,
    header: ["Date", "Mouvement", "Montant (FCFA)"],
    rows: [
      [formatShortDate(caution.depositedAt), "Dépôt de la caution", `+ ${formatAmount(caution.amount)}`],
      ...caution.movements.map((movement) => [
        formatShortDate(movement.date),
        movement.label,
        `${movement.kind === "prelevement" ? "−" : "+"} ${formatAmount(movement.amount)}`,
      ]),
      ["", "Caution restante", formatAmount(remainingAmount(caution))],
    ],
    footer: `${caution.agreement.reference} · ${caution.agreement.tenant} · ${caution.agreement.property} · ${modeLongText(caution)}`,
  };
}
