import { initials } from "@/components/layout";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatMonthYear, formatShortDate } from "@/lib/utils/dates";
import type { ExportTable } from "@/lib/utils/export";
import { formatAmount } from "@/lib/utils/format";
import { formatPhone, phoneDigits } from "@/lib/utils/phone";
import { daysLate, paidPercent, paymentStatus, remaining } from "../hooks/rent_payments_status";
import type { RentPayment } from "../types";
import { avatarTones, paymentMethods, paymentStatuses } from "./rent_payments_styles";

// Small building blocks shared by the table, the mobile cards and the row menu.

/** "2025-01-10" → "10 janv." */
export function formatDayMonth(isoDate: string) {
  return formatShortDate(isoDate).replace(/ \d{4}$/, "");
}

/** "Janvier 2025" */
export function periodLabel(payment: RentPayment) {
  const text = formatMonthYear(payment.period);
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** "Partiellement payé (60 %)", "En retard (+5 jours)", "À payer · échéance 10 janv." */
export function statusLabel(payment: RentPayment, asOf: string) {
  const status = paymentStatus(payment, asOf);
  const base = paymentStatuses[status].label;
  switch (status) {
    case "paye":
      return base;
    case "partiel":
      return `${base} (${Math.round(paidPercent(payment))} %)`;
    case "en_retard": {
      const days = daysLate(payment, asOf);
      return `${base} (+${days} jour${days > 1 ? "s" : ""})`;
    }
    case "a_payer":
      return `${base} · échéance ${formatDayMonth(payment.dueDate)}`;
  }
}

/** Method chip text: what was used, or what is awaited. */
export function settlementLabel(payment: RentPayment) {
  if (payment.settlement) return payment.settlement.label;
  return payment.expectedMethod === "virement" ? "Attente virement" : "En attente";
}

/** WhatsApp chat with the right message for the payment's state, prefilled. */
export function whatsappMessageUrl(payment: RentPayment, asOf: string) {
  const status = paymentStatus(payment, asOf);
  const period = formatMonthYear(payment.period);
  const greeting = `Bonjour ${payment.tenant.name},`;
  const text =
    status === "paye"
      ? `${greeting} nous confirmons la bonne réception de votre loyer de ${period} (${formatAmount(payment.rent)} FCFA) pour ${payment.bien.title}. Merci !`
      : status === "partiel"
        ? `${greeting} nous avons bien reçu ${formatAmount(payment.paid)} FCFA sur votre loyer de ${period} (${formatAmount(payment.rent)} FCFA). Il reste ${formatAmount(remaining(payment))} FCFA à régler pour ${payment.bien.title}.`
        : status === "en_retard"
          ? `${greeting} sauf erreur de notre part, le loyer de ${period} (${formatAmount(payment.rent)} FCFA) pour ${payment.bien.title} était dû le ${formatShortDate(payment.dueDate)}. Merci de régulariser dès que possible.`
          : `${greeting} petit rappel : le loyer de ${period} (${formatAmount(payment.rent)} FCFA) pour ${payment.bien.title} est attendu le ${formatShortDate(payment.dueDate)}.`;
  return `https://wa.me/${phoneDigits(payment.tenant.phone)}?text=${encodeURIComponent(`${text} — ImmoAsk Business`)}`;
}

function avatarTone(name: string) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return avatarTones[hash % avatarTones.length];
}

export function TenantAvatar({ name, late = false, className }: { name: string; late?: boolean; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold",
        late ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" : avatarTone(name),
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}

export function ReferenceCell({ payment, asOf }: { payment: RentPayment; asOf: string }) {
  const late = paymentStatus(payment, asOf) === "en_retard";
  const date = payment.paidDate ?? payment.dueDate;
  return (
    <div>
      <p
        className={cn(
          "font-semibold whitespace-nowrap",
          late ? "text-red-700 dark:text-red-400" : "text-brand-700 dark:text-brand-100",
        )}
      >
        #{payment.reference}
      </p>
      <p
        className={cn(
          "mt-0.5 text-[13px] whitespace-nowrap",
          late ? "text-red-600 dark:text-red-400" : "text-zinc-500 dark:text-zinc-400",
        )}
      >
        {late ? `Échu le ${formatDayMonth(payment.dueDate)}` : formatShortDate(date)}
      </p>
    </div>
  );
}

export function TenantCell({ payment, asOf }: { payment: RentPayment; asOf: string }) {
  const late = paymentStatus(payment, asOf) === "en_retard";
  return (
    <div className="flex min-w-0 items-center gap-3">
      <TenantAvatar name={payment.tenant.name} late={late} />
      <div className="min-w-0">
        <p className="truncate font-semibold text-zinc-950 dark:text-zinc-50" title={payment.tenant.name}>
          {payment.tenant.name}
        </p>
        <a
          href={`tel:${payment.tenant.phone}`}
          onClick={(event) => event.stopPropagation()}
          className={cn(
            "mt-0.5 block truncate text-[13px] tabular-nums hover:underline",
            late ? "text-red-600 dark:text-red-400" : "text-zinc-500 hover:text-brand-700 dark:text-zinc-400",
          )}
        >
          {formatPhone(payment.tenant.phone)}
        </a>
      </div>
    </div>
  );
}

export function BienCell({ payment }: { payment: RentPayment }) {
  return (
    <div className="min-w-0">
      <p className="truncate font-semibold text-zinc-900 dark:text-zinc-100" title={payment.bien.title}>
        {payment.bien.title}
      </p>
      <p className="mt-0.5 truncate text-[13px] text-zinc-500 dark:text-zinc-400">
        {payment.bien.quartier}, {payment.bien.city}
        {payment.bien.lot ? ` · Lot ${payment.bien.lot}` : ""}
      </p>
    </div>
  );
}

export function RentCell({ payment, asOf }: { payment: RentPayment; asOf: string }) {
  const late = paymentStatus(payment, asOf) === "en_retard";
  return (
    <div>
      <p className="font-bold whitespace-nowrap text-zinc-950 tabular-nums dark:text-zinc-50">
        {formatAmount(payment.rent)} <span className="text-[11px] font-semibold text-zinc-500">FCFA</span>
      </p>
      <p className={cn("mt-0.5 text-[13px]", late ? "text-red-600 dark:text-red-400" : "text-zinc-500 dark:text-zinc-400")}>
        {periodLabel(payment)}
      </p>
    </div>
  );
}

/** Amount received, what is left, and a progress bar. */
export function PaidCell({ payment, asOf, showMethod = false }: { payment: RentPayment; asOf: string; showMethod?: boolean }) {
  const status = paymentStatuses[paymentStatus(payment, asOf)];
  const left = remaining(payment);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className={cn("font-bold whitespace-nowrap tabular-nums", status.amount)}>
          {formatAmount(payment.paid)} <span className="text-[11px] font-semibold">FCFA</span>
        </span>
        <span
          className={cn(
            "text-xs font-semibold whitespace-nowrap tabular-nums",
            left === 0 ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-700 dark:text-zinc-300",
          )}
        >
          {left === 0 ? "Reste 0" : `Dû ${formatAmount(left)}`}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={`Loyer payé de ${payment.tenant.name}`}
        aria-valuenow={Math.round(paidPercent(payment))}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10"
      >
        <div className={cn("h-full rounded-full", status.bar)} style={{ width: `${paidPercent(payment)}%` }} />
      </div>
      {showMethod ? (
        <p className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          <Icon name={paymentMethods[payment.settlement?.method ?? "attente"].icon} className="size-3.5 shrink-0" />
          <span className="truncate">{settlementLabel(payment)}</span>
        </p>
      ) : null}
    </div>
  );
}

export function SettlementChip({ payment }: { payment: RentPayment }) {
  const method = paymentMethods[payment.settlement?.method ?? "attente"];
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[13px] font-semibold",
        method.chip,
      )}
    >
      <Icon name={method.icon} className="size-4 shrink-0" />
      <span className="truncate">{settlementLabel(payment)}</span>
    </span>
  );
}

export function StatusBadge({ payment, asOf }: { payment: RentPayment; asOf: string }) {
  const status = paymentStatuses[paymentStatus(payment, asOf)];
  return (
    <span
      className={cn(
        "inline-flex items-start gap-1.5 rounded-2xl px-3 py-1 text-[13px] leading-snug font-semibold",
        status.badge,
      )}
    >
      <span aria-hidden="true" className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", status.dot)} />
      {statusLabel(payment, asOf)}
    </span>
  );
}

/** Printable receipt: a "quittance" when fully paid, a payment receipt otherwise. */
export function receiptTable(payment: RentPayment, asOf: string): ExportTable {
  const full = paymentStatus(payment, asOf) === "paye";
  return {
    title: `${full ? "Quittance de loyer" : "Reçu de paiement partiel"} ${payment.reference} — ${payment.tenant.name}`,
    header: ["Désignation", "Montant"],
    rows: [
      [`Loyer ${formatMonthYear(payment.period)}`, `${formatAmount(payment.rent)} FCFA`],
      ["Montant reçu", `${formatAmount(payment.paid)} FCFA`],
      ["Reste à payer", `${formatAmount(remaining(payment))} FCFA`],
      ["Locataire", payment.tenant.name],
      [
        "Bien",
        `${payment.bien.title}, ${payment.bien.quartier} (${payment.bien.city})${payment.bien.lot ? ` · Lot ${payment.bien.lot}` : ""}`,
      ],
      ["Règlement", settlementLabel(payment)],
      ["Date", payment.paidDate ? formatShortDate(payment.paidDate) : "—"],
    ],
    footer: full
      ? "Quittance valant reçu pour le loyer ci-dessus, sous réserve d'encaissement définitif."
      : "Reçu d'un paiement partiel : ne vaut pas quittance du loyer.",
  };
}
