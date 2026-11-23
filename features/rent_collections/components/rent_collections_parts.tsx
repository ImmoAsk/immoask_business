import { initials } from "@/components/layout";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/utils/dates";
import { formatAmount } from "@/lib/utils/format";
import { formatPhone } from "@/lib/utils/phone";
import { collectionTotal, hasLine, natureLabel } from "../hooks/rent_collections_money";
import type { RentCollection } from "../types";
import { avatarTones, channelIcons, collectionStatuses } from "./rent_collections_styles";

// Small building blocks shared by the table, the mobile cards and the detail panel.

/** "Flooz Moov · #FZ-30291" */
export function channelText(collection: RentCollection) {
  return collection.transactionRef ? `${collection.channelLabel} · #${collection.transactionRef}` : collection.channelLabel;
}

export function statusLabel(collection: RentCollection) {
  const base = collectionStatuses[collection.status].label;
  return collection.daysLate ? `${base} (J-${collection.daysLate})` : base;
}

function avatarTone(name: string) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return avatarTones[hash % avatarTones.length];
}

export function TenantAvatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("grid size-11 shrink-0 place-items-center rounded-full text-sm font-bold", avatarTone(name), className)}
    >
      {initials(name)}
    </span>
  );
}

export function ReferenceCell({ collection }: { collection: RentCollection }) {
  return (
    <div>
      <p className="font-semibold whitespace-nowrap text-brand-700 dark:text-brand-100">#{collection.reference}</p>
      <p className="mt-0.5 text-[13px] whitespace-nowrap text-zinc-500 dark:text-zinc-400">
        {formatShortDate(collection.date)}
      </p>
    </div>
  );
}

export function TenantCell({ collection }: { collection: RentCollection }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <TenantAvatar name={collection.tenant.name} />
      <div className="min-w-0">
        <p className="truncate font-semibold text-zinc-950 dark:text-zinc-50" title={collection.tenant.name}>
          {collection.tenant.name}
        </p>
        <p className="mt-0.5 truncate text-[13px] text-zinc-500 tabular-nums dark:text-zinc-400">
          {formatPhone(collection.tenant.phone)}
        </p>
      </div>
    </div>
  );
}

export function NatureBadge({ collection }: { collection: RentCollection }) {
  const special = hasLine(collection, "caution") || hasLine(collection, "service");
  return (
    <span
      className={cn(
        "inline-flex max-w-full truncate rounded-lg px-2 py-0.5 text-xs font-semibold",
        special
          ? "bg-brand-100 text-brand-800 dark:bg-brand-800/60 dark:text-brand-100"
          : "bg-zinc-100 text-zinc-700 dark:bg-white/10 dark:text-zinc-300",
      )}
    >
      {natureLabel(collection)}
    </span>
  );
}

export function BienCell({ collection }: { collection: RentCollection }) {
  return (
    <div className="min-w-0">
      <p className="truncate font-semibold text-zinc-900 dark:text-zinc-100" title={collection.bien.title}>
        {collection.bien.title}
      </p>
      <div className="mt-1 flex">
        <NatureBadge collection={collection} />
      </div>
    </div>
  );
}

export function Fcfa({ amount, className }: { amount: number; className?: string }) {
  return (
    <span className={cn("font-bold whitespace-nowrap text-zinc-950 tabular-nums dark:text-zinc-50", className)}>
      {formatAmount(amount)} <span className="text-[0.7em] font-semibold text-zinc-500 dark:text-zinc-400">FCFA</span>
    </span>
  );
}

export function AmountCell({ collection, align = "right" }: { collection: RentCollection; align?: "left" | "right" }) {
  return (
    <div className={cn(align === "right" && "text-right")}>
      <Fcfa amount={collectionTotal(collection)} className="text-base" />
      <p
        className={cn(
          "mt-0.5 flex items-center gap-1.5 text-[13px] text-zinc-500 dark:text-zinc-400",
          align === "right" && "justify-end",
        )}
      >
        <Icon name={channelIcons[collection.channel]} className="size-3.5 shrink-0" />
        <span className="truncate">{channelText(collection)}</span>
      </p>
    </div>
  );
}

export function StatusBadge({ collection }: { collection: RentCollection }) {
  const status = collectionStatuses[collection.status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold whitespace-nowrap",
        status.badge,
      )}
    >
      <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", status.dot)} />
      {statusLabel(collection)}
    </span>
  );
}
