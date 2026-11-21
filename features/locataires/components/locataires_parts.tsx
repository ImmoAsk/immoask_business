import { initials } from "@/components/layout";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icon";
import { PropertyThumbnail } from "@/components/ui/property_thumbnail";
import { cn } from "@/lib/cn";
import { formatAmount, MONTHS_SHORT } from "@/lib/utils/format";
import type { Locataire, LocatairePaymentChannel } from "../types";
import { avatarTones, leaseTypes, paymentStatuses } from "./locataires_styles";

// Small building blocks shared by the table, the list and the map popup.

/** "+22890123456" → "+228 90 12 34 56" */
export function formatPhone(phone: string) {
  const match = /^\+228(\d{2})(\d{2})(\d{2})(\d{2})$/.exec(phone);
  return match ? `+228 ${match.slice(1).join(" ")}` : phone;
}

/** "2025-01-05" → "05 Janv." */
export function formatDayMonth(isoDate: string) {
  const [, month, day] = isoDate.split("-").map(Number);
  return `${String(day).padStart(2, "0")} ${MONTHS_SHORT[month - 1]}.`;
}

export function paymentLabel(locataire: Locataire) {
  const base = paymentStatuses[locataire.payment.status].label;
  return locataire.payment.daysLate ? `${base} (J-${locataire.payment.daysLate})` : base;
}

/** WhatsApp chat with a polite reminder, prefilled. */
export function whatsappReminderUrl(locataire: Locataire) {
  const text =
    `Bonjour ${locataire.name}, petit rappel concernant le loyer de ${formatAmount(locataire.rent)} FCFA ` +
    `pour ${locataire.bien.title}. Merci de régulariser dès que possible. — ImmoAsk Business`;
  return `https://wa.me/${locataire.phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

function avatarTone(name: string) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return avatarTones[hash % avatarTones.length];
}

export function LocatairesAvatar({ locataire, className }: { locataire: Locataire; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-full text-sm font-semibold",
        avatarTone(locataire.name),
        className,
      )}
    >
      {initials(locataire.name)}
    </span>
  );
}

export function LocatairesIdentity({ locataire, showOccupation = true }: { locataire: Locataire; showOccupation?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <LocatairesAvatar locataire={locataire} />
      <div className="min-w-0">
        <p className="leading-snug font-semibold text-zinc-950 dark:text-zinc-50">{locataire.name}</p>
        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
          {showOccupation ? <span className="block truncate">{locataire.occupation}</span> : null}
          <a
            href={`tel:${locataire.phone}`}
            className="whitespace-nowrap tabular-nums hover:text-brand-700 hover:underline dark:hover:text-brand-100"
          >
            {formatPhone(locataire.phone)}
          </a>
        </p>
      </div>
    </div>
  );
}

export function LeaseTypeBadge({ locataire }: { locataire: Locataire }) {
  const lease = leaseTypes[locataire.lease.type];
  return (
    <span className={cn("inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-semibold whitespace-nowrap", lease.badge)}>
      {lease.label}
    </span>
  );
}

export function LocatairesBienCell({ locataire, compact = false }: { locataire: Locataire; compact?: boolean }) {
  const bien = locataire.bien;
  return (
    <div className="flex min-w-0 items-center gap-3">
      <PropertyThumbnail kind={bien.kind} photoUrl={bien.photoUrl} compact className="h-11 w-14 shrink-0 rounded-xl" />
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{bien.title}</span>
          {compact ? null : <LeaseTypeBadge locataire={locataire} />}
        </p>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
          <Icon name="mapPin" className="size-3.5 shrink-0 text-zinc-400" />
          <span className="truncate">
            {bien.city}, {bien.quartier}
            {compact ? null : ` • Réf. ${bien.reference}`}
          </span>
        </p>
      </div>
    </div>
  );
}

export function PaymentBadge({ locataire, short = false }: { locataire: Locataire; short?: boolean }) {
  const status = paymentStatuses[locataire.payment.status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap",
        status.badge,
      )}
    >
      <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", status.dot)} />
      {short ? status.label : paymentLabel(locataire)}
    </span>
  );
}

const channelIcons: Record<LocatairePaymentChannel, IconName> = {
  virement: "bank",
  mobile_money: "phone",
  especes: "cash",
};

export function LocatairesRent({ locataire, showChannel = true }: { locataire: Locataire; showChannel?: boolean }) {
  return (
    <div>
      <p className="font-bold whitespace-nowrap text-zinc-950 tabular-nums dark:text-zinc-50">
        {formatAmount(locataire.rent)} FCFA
      </p>
      {showChannel ? (
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          <Icon name={channelIcons[locataire.payment.channel]} className="size-3.5 shrink-0" />
          {locataire.payment.label}
        </p>
      ) : null}
    </div>
  );
}

export function QuittanceCell({ locataire }: { locataire: Locataire }) {
  const quittance = locataire.lastQuittance;
  switch (quittance.kind) {
    case "envoyee":
      return (
        <div className="text-[13px]">
          <p className="flex items-center gap-1.5 whitespace-nowrap text-zinc-800 dark:text-zinc-200">
            <Icon name="calendarCheck" className="size-4 shrink-0 text-brand-600 dark:text-brand-100" />
            Envoyée le {formatDayMonth(quittance.date)}
          </p>
          <p className="mt-0.5 truncate pl-5.5 text-xs text-zinc-500 dark:text-zinc-400">N° {quittance.numero}</p>
        </div>
      );
    case "en_attente":
      return (
        <div className="text-[13px]">
          <p className="flex items-center gap-1.5 font-medium text-orange-600 dark:text-orange-400">
            <Icon name="hourglass" className="size-4 shrink-0" />
            En attente règlement
          </p>
          <p className="mt-0.5 pl-5.5 text-xs text-zinc-500 dark:text-zinc-400">{quittance.note}</p>
        </div>
      );
    case "relance":
      return (
        <div className="text-[13px]">
          <p className="flex items-center gap-1.5 font-medium text-orange-600 dark:text-orange-400">
            <Icon name="bell" className="size-4 shrink-0" />
            Relancé le {formatDayMonth(quittance.date)}
          </p>
          {quittance.promiseDate ? (
            <p className="mt-0.5 pl-5.5 text-xs text-zinc-500 dark:text-zinc-400">
              Promesse au {formatDayMonth(quittance.promiseDate)}
            </p>
          ) : null}
        </div>
      );
  }
}
