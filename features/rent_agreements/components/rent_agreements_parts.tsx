import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/utils/dates";
import type { ExportTable } from "@/lib/utils/export";
import { formatAmount } from "@/lib/utils/format";
import { agreementStatus, depositAmount, stayNights } from "../hooks/rent_agreements_status";
import type { RentAgreement } from "../types";
import { agreementStatuses, agreementTypes, terminationReasons } from "./rent_agreements_styles";

// Small building blocks shared by the table, the mobile cards, the detail panel and the exports.

/** First and last name initials; legal forms skipped ("Togo Digital SA" → "TD"). */
export function tenantInitials(name: string) {
  const words = name.split(/\s+/).filter((word) => /^\p{Lu}/u.test(word) && !/^(SA|SARL|SAS|SCI)$/.test(word));
  const picked = words.length > 1 ? [words[0], words.at(-1)!] : words;
  return picked.map((word) => word[0]).join("");
}

/** "400 000 FCFA" with "par mois" or "au total · 7 nuits" under it. */
export function amountText(agreement: RentAgreement) {
  return {
    value: `${formatAmount(agreement.amount)} FCFA`,
    sub: agreement.type === "sejour" ? `au total · ${stayNights(agreement)} nuits` : "par mois",
  };
}

/** "2 mois de loyer" / "Montant forfaitaire", with the FCFA amount. */
export function depositText(agreement: RentAgreement) {
  return {
    label: agreement.deposit.mode === "mois" ? `${agreement.deposit.months} mois de loyer` : "Montant forfaitaire",
    value: `${formatAmount(depositAmount(agreement))} FCFA`,
  };
}

export function TenantAvatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-full bg-linear-to-br from-brand-50 to-brand-100 text-[11px] font-bold text-brand-700 dark:from-brand-900 dark:to-brand-800 dark:text-brand-100",
        className,
      )}
    >
      {tenantInitials(name)}
    </span>
  );
}

export function TypeBadge({ agreement }: { agreement: RentAgreement }) {
  const type = agreementTypes[agreement.type];
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap", type.badge)}>{type.label}</span>;
}

export function StatusBadge({ agreement, asOf, className }: { agreement: RentAgreement; asOf: string; className?: string }) {
  const status = agreementStatuses[agreementStatus(agreement, asOf)];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap", status.badge, className)}>
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", status.dot)} />
      {status.label}
    </span>
  );
}

/** Printable summary of one lease ("Télécharger le contrat"). */
export function contractSheet(agreement: RentAgreement, asOf: string): ExportTable {
  const amount = amountText(agreement);
  const deposit = depositText(agreement);
  return {
    title: `Contrat de location ${agreement.reference}`,
    header: ["Rubrique", "Valeur"],
    rows: [
      ["Locataire", agreement.tenant],
      ["Propriété", agreement.property],
      ["Contrat de gestion", agreement.management.label],
      ["Type de contrat", agreementTypes[agreement.type].label],
      ["Montant final", `${amount.value} ${amount.sub}`],
      ["Date de début", formatShortDate(agreement.startDate)],
      ...(agreement.endDate ? [["Date de fin", formatShortDate(agreement.endDate)]] : []),
      ["Caution", `${deposit.value} (${deposit.label.toLowerCase()})`],
      ["Statut", agreementStatuses[agreementStatus(agreement, asOf)].label],
      ...(agreement.termination
        ? [["Résiliation", `${formatShortDate(agreement.termination.date)} · ${terminationReasons[agreement.termination.reason]}`]]
        : []),
    ],
    footer: "Récapitulatif généré par ImmoAsk Business ; le bail signé fait foi.",
  };
}
