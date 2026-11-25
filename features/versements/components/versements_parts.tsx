import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/utils/dates";
import type { ExportTable } from "@/lib/utils/export";
import { formatAmount } from "@/lib/utils/format";
import { fileExtension, fileSize, METHOD_LABELS, TYPE_LABELS } from "../hooks/versements_labels";
import type { Versement, VersementMethod, VersementType } from "../types";
import { fileTiles, methodIcons, typeStyles } from "./versements_styles";

// Small building blocks shared by the table, the mobile cards, the detail panel and the exports.

/** "1 850 000 FCFA", "1 250 EUR" */
export const amountText = (versement: Versement) => `${formatAmount(versement.amount)} ${versement.currency}`;

export function TypeBadge({ type, className }: { type: VersementType; className?: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap", typeStyles[type].badge, className)}>
      {TYPE_LABELS[type]}
    </span>
  );
}

export function MethodLabel({ method, className }: { method: VersementMethod; className?: string }) {
  return (
    <span className={cn("flex min-w-0 items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100", className)}>
      <span className="grid size-8 shrink-0 place-items-center rounded-[9px] bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100">
        <Icon name={methodIcons[method]} className="size-4" strokeWidth={2} />
      </span>
      <span className="truncate">{METHOD_LABELS[method]}</span>
    </span>
  );
}

/** File type tile ("PDF", "JPG"). */
export function FileTile({ name, large, className }: { name: string; large?: boolean; className?: string }) {
  const extension = fileExtension(name);
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative flex shrink-0 flex-col items-center justify-center gap-1.5 overflow-hidden bg-linear-to-br font-extrabold tracking-wider text-white",
        fileTiles[extension] ?? fileTiles.PDF,
        large ? "h-[72px] w-[58px] rounded-[10px] text-[10px]" : "h-9 w-8 rounded-lg text-[9.5px]",
        className,
      )}
    >
      <span className="absolute -top-3 -right-3 size-9 rounded-full bg-white/20" />
      {large ? <Icon name="file" className="relative size-5.5" strokeWidth={1.9} /> : null}
      <span className="relative">{extension}</span>
    </span>
  );
}

export function Attachment({ versement, className }: { versement: Versement; className?: string }) {
  return (
    <span className={cn("flex min-w-0 items-center gap-2.5", className)}>
      <FileTile name={versement.attachment.name} />
      <span className="min-w-0">
        <span className="block truncate text-[13px] font-semibold text-zinc-900 dark:text-zinc-100" title={versement.attachment.name}>
          {versement.attachment.name}
        </span>
        <span className="block text-xs text-zinc-500 dark:text-zinc-400">{fileSize(versement.attachment.size)}</span>
      </span>
    </span>
  );
}

/** Rows for the CSV / PDF export of the list. */
export function versementsExportTable(versements: Versement[]): ExportTable {
  return {
    title: "Versements ImmoAsk",
    header: [
      "N° versement",
      "Contrat de gestion",
      "Propriétaire",
      "Bien",
      "Gestionnaire",
      "Type",
      "Montant",
      "Devise",
      "Moyen",
      "Compte",
      "Référence de transaction",
      "Date du dépôt",
      "Pièce jointe",
    ],
    rows: versements.map((versement) => [
      versement.reference,
      versement.management.reference,
      versement.management.owner,
      versement.management.property,
      versement.management.manager,
      TYPE_LABELS[versement.type],
      versement.amount,
      versement.currency,
      METHOD_LABELS[versement.method],
      versement.account,
      versement.transactionRef,
      formatShortDate(versement.date),
      versement.attachment.name,
    ]),
  };
}

/** "Reçu PDF" for one payout. */
export function versementReceipt(versement: Versement): ExportTable {
  return {
    title: `Reçu de versement ${versement.reference}`,
    header: ["Rubrique", "Valeur"],
    rows: [
      ["Montant versé", amountText(versement)],
      ["Type de dépôt", TYPE_LABELS[versement.type]],
      ["Contrat de gestion", `${versement.management.reference} · ${versement.management.property}`],
      ["Propriétaire", versement.management.owner],
      ["Gestionnaire", versement.management.manager],
      ["Date du dépôt", formatShortDate(versement.date)],
      ["Moyen de versement", `${METHOD_LABELS[versement.method]} · ${versement.account}`],
      ["Référence de transaction", versement.transactionRef],
      ["Pièce jointe", versement.attachment.name],
    ],
    footer: "Reçu généré par ImmoAsk Business ; le justificatif joint fait foi.",
  };
}
