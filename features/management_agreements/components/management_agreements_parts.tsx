import { cn } from "@/lib/cn";
import { formatAmount } from "@/lib/utils/format";
import type { ManagementAgreement, ManagementRemuneration } from "../types";
import { agreementStatuses } from "./management_agreements_styles";

// Small building blocks shared by the table, the mobile cards, the detail panel and the exports.

/** First and last name initials; particles and legal forms skipped ("SCI Kara Habitat" → "KH"). */
export function ownerInitials(name: string) {
  const words = name.split(/\s+/).filter((word) => /^\p{Lu}/u.test(word) && !/^(SA|SARL|SAS|SCI)$/.test(word));
  const picked = words.length > 1 ? [words[0], words.at(-1)!] : words;
  return picked.map((word) => word[0]).join("");
}

export const ownerKindLabel = (agreement: ManagementAgreement) =>
  agreement.owner.kind === "societe" ? "Société" : "Particulier";

/** Table: "8 % des loyers" / "150 000 FCFA", with "Pourcentage" / "Montant fixe / mois" under it. */
export function remunerationShort(remuneration: ManagementRemuneration) {
  return remuneration.mode === "pourcentage" ? `${remuneration.percent} % des loyers` : `${formatAmount(remuneration.amount)} FCFA`;
}
export function remunerationType(remuneration: ManagementRemuneration) {
  return remuneration.mode === "pourcentage" ? "Pourcentage" : "Montant fixe / mois";
}

/** Detail panel: mode, and the value's label and text. */
export function remunerationDetail(remuneration: ManagementRemuneration) {
  return remuneration.mode === "pourcentage"
    ? { mode: "Pourcentage des loyers", label: "Taux de gestion", value: `${remuneration.percent} %` }
    : { mode: "Montant fixe", label: "Montant fixe", value: `${formatAmount(remuneration.amount)} FCFA / mois` };
}

/** "TG53 •••• •••• •••• •••• •••• 3458" */
export function maskIban(iban: string) {
  return `${iban.slice(0, 4)} •••• •••• •••• •••• •••• ${iban.slice(-4)}`;
}

export function OwnerAvatar({ agreement, className }: { agreement: ManagementAgreement; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full bg-linear-to-br from-brand-50 to-brand-100 text-xs font-bold text-brand-700 dark:from-brand-900 dark:to-brand-800 dark:text-brand-100",
        className,
      )}
    >
      {ownerInitials(agreement.owner.name)}
    </span>
  );
}

export function StatusBadge({ agreement, className }: { agreement: ManagementAgreement; className?: string }) {
  const status = agreementStatuses[agreement.status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        status.badge,
        className,
      )}
    >
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", status.dot)} />
      {status.label}
    </span>
  );
}
