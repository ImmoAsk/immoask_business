import { PropertyThumbnail } from "@/components/ui/property_thumbnail";
import { cn } from "@/lib/cn";
import { formatAmount } from "@/lib/utils/format";
import { formatPhone } from "@/lib/utils/phone";

export { formatPhone };
import { lotCount } from "../hooks/proprietaires_money";
import type { Proprietaire } from "../types";
import { avatarTones, mandateTypes, profileLabels, reversementStatuses } from "./proprietaires_styles";

// Small building blocks shared by the table, the list and the map popup.

const MONTHS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

/** "2025-01-05" → "5 janv. 2025" */
export function formatTransferDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

/** "Résident · Lomé", "Diaspora · Paris" */
export function profileLine(proprietaire: Proprietaire) {
  return `${profileLabels[proprietaire.profile]} · ${proprietaire.residence}`;
}

/** "4 biens · 6 lots" */
export function portfolioLine(proprietaire: Proprietaire) {
  const biens = proprietaire.biens.length;
  const lots = lotCount(proprietaire);
  return `${biens} bien${biens > 1 ? "s" : ""} · ${lots} lot${lots > 1 ? "s" : ""}`;
}

/** First and last name initials; company particles and legal forms are skipped ("Société Immobilière du Golfe" → "SG"). */
export function ownerInitials(name: string) {
  const words = name
    .split(/\s+/)
    .filter((word) => /^\p{Lu}/u.test(word) && !/^(SA|SARL|SAS|SCI)$/.test(word));
  const picked = words.length > 1 ? [words[0], words.at(-1)!] : words;
  return picked.map((word) => word[0]).join("");
}

export function ProprietairesAvatar({ proprietaire, className }: { proprietaire: Proprietaire; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-full text-sm font-bold ring-4",
        avatarTones[proprietaire.profile],
        className,
      )}
    >
      {ownerInitials(proprietaire.name)}
    </span>
  );
}

export function ProprietairesIdentity({ proprietaire }: { proprietaire: Proprietaire }) {
  return (
    <div className="flex min-w-0 items-center gap-3.5">
      <ProprietairesAvatar proprietaire={proprietaire} />
      <div className="min-w-0">
        <p className="truncate leading-snug font-semibold text-zinc-950 dark:text-zinc-50" title={proprietaire.name}>
          {proprietaire.name}
        </p>
        <p className="mt-0.5 truncate text-[13px] text-zinc-500 dark:text-zinc-400">
          {profileLine(proprietaire)}
          {proprietaire.status === "suspendu" ? (
            <span className="ml-2 rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
              Suspendu
            </span>
          ) : null}
        </p>
      </div>
    </div>
  );
}

export function MandateBadge({ proprietaire }: { proprietaire: Proprietaire }) {
  const mandate = mandateTypes[proprietaire.mandate.type];
  return (
    <span className={cn("inline-flex rounded-md px-2 py-0.5 text-xs font-semibold whitespace-nowrap", mandate.badge)}>
      {mandate.label}
    </span>
  );
}

/** Up to three overlapping property tiles, "N biens · N lots" and the mandate type. */
export function PortfolioCell({ proprietaire, showMandate = true }: { proprietaire: Proprietaire; showMandate?: boolean }) {
  const shown = proprietaire.biens.slice(0, 3);
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex shrink-0 -space-x-2.5" aria-hidden="true">
        {shown.map((bien) => (
          <PropertyThumbnail
            key={bien.id}
            kind={bien.kind}
            photoUrl={bien.photoUrl}
            compact
            className="size-9 rounded-xl ring-2 ring-white dark:ring-zinc-950 [&_svg]:size-4"
          />
        ))}
      </div>
      <div className="min-w-0">
        <p className="font-semibold whitespace-nowrap text-zinc-900 dark:text-zinc-100">{portfolioLine(proprietaire)}</p>
        {showMandate ? (
          <div className="mt-1">
            <MandateBadge proprietaire={proprietaire} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function RevenueCell({ proprietaire }: { proprietaire: Proprietaire }) {
  return (
    <div>
      {proprietaire.monthlyRevenue > 0 ? (
        <p className="font-bold whitespace-nowrap text-zinc-950 tabular-nums dark:text-zinc-50">
          {formatAmount(proprietaire.monthlyRevenue)}{" "}
          <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">FCFA</span>
        </p>
      ) : (
        <p className="font-semibold text-zinc-400 dark:text-zinc-500">Aucun revenu</p>
      )}
      <p className="mt-0.5 text-[13px] text-zinc-500 dark:text-zinc-400">Frais {proprietaire.mandate.feePercent} %</p>
    </div>
  );
}

export function ReversementBadge({ proprietaire }: { proprietaire: Proprietaire }) {
  const status = reversementStatuses[proprietaire.reversement.status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold whitespace-nowrap",
        status.badge,
      )}
      title={
        proprietaire.reversement.scheduledDate
          ? `Virement prévu le ${formatTransferDate(proprietaire.reversement.scheduledDate)}`
          : undefined
      }
    >
      <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", status.dot)} />
      {status.label}
    </span>
  );
}

export function LastTransferCell({ proprietaire }: { proprietaire: Proprietaire }) {
  return (
    <div>
      <p className="font-semibold whitespace-nowrap text-zinc-900 dark:text-zinc-100">
        {formatTransferDate(proprietaire.reversement.lastTransferDate)}
      </p>
      <p className="mt-0.5 truncate text-[13px] text-zinc-500 dark:text-zinc-400">{proprietaire.reversement.label}</p>
    </div>
  );
}
