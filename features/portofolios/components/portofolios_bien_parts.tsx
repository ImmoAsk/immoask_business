import { initials } from "@/components/layout";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icon";
import { PropertyThumbnail } from "@/components/ui/property_thumbnail";
import { cn } from "@/lib/cn";
import { formatAmount } from "@/lib/utils/format";
import type { PortofolioBien, PortofolioFeatureIcon } from "../types";
import { portofolioPayments, portofolioStatuses } from "./portofolios_styles";

// Small building blocks shared by the table, the mobile cards and the map.

const featureIcons: Record<PortofolioFeatureIcon, IconName> = {
  rooms: "bed",
  surface: "surface",
  extra: "sparkles",
};

export function PortofoliosThumbnail({
  bien,
  compact = false,
  className,
}: {
  bien: PortofolioBien;
  /** Icon only, without the type caption. */
  compact?: boolean;
  className?: string;
}) {
  return <PropertyThumbnail kind={bien.type} photoUrl={bien.photoUrl} compact={compact} className={className} />;
}

export function statusLabel(bien: PortofolioBien) {
  const base = portofolioStatuses[bien.status].label;
  if (bien.status === "vacant" && bien.statusNote) return `${base} / ${bien.statusNote}`;
  if (bien.status === "loue" && bien.units.total > 1) return `${base} (${bien.units.occupied}/${bien.units.total})`;
  return base;
}

export function PortofoliosStatusBadge({ bien }: { bien: PortofolioBien }) {
  const status = portofolioStatuses[bien.status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs leading-tight font-semibold",
        status.badge,
      )}
    >
      <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", status.dot)} />
      {statusLabel(bien)}
    </span>
  );
}

export function PortofoliosFeatures({ bien, limit = 3 }: { bien: PortofolioBien; limit?: number }) {
  return (
    <ul className="flex flex-col gap-1.5 text-[13px] text-zinc-600 dark:text-zinc-300">
      {bien.features.slice(0, limit).map((feature) => (
        <li key={feature.label} className="flex items-center gap-2">
          <Icon name={featureIcons[feature.icon]} className="size-4 shrink-0 text-zinc-400" />
          <span className="truncate">{feature.label}</span>
        </li>
      ))}
    </ul>
  );
}

export function PortofoliosLocation({ bien }: { bien: PortofolioBien }) {
  return (
    <div className="flex gap-2">
      <Icon name="mapPin" className="mt-0.5 size-4 shrink-0 text-zinc-400" />
      <div className="min-w-0">
        <p className="font-medium text-zinc-900 dark:text-zinc-100">
          {bien.location.quartier}, {bien.location.city}
        </p>
        {bien.location.zone ? <p className="text-xs text-zinc-500 dark:text-zinc-400">{bien.location.zone}</p> : null}
      </div>
    </div>
  );
}

export function PortofoliosOccupant({ bien }: { bien: PortofolioBien }) {
  const occupant = bien.occupant;
  switch (occupant.kind) {
    case "locataire":
      return (
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200">
            {initials(occupant.name)}
          </span>
          <div className="min-w-0">
            <p className="leading-snug font-medium text-zinc-900 dark:text-zinc-100">{occupant.name}</p>
            <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">{occupant.detail}</p>
          </div>
        </div>
      );
    case "agence":
      return (
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full border border-zinc-200 text-zinc-500 dark:border-white/10 dark:text-zinc-400">
            <Icon name="key" className="size-4" />
          </span>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">{occupant.label}</p>
        </div>
      );
    case "travaux":
      return (
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-300">
            <Icon name="wrench" className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="leading-snug font-medium text-orange-700 dark:text-orange-300">{occupant.label}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{occupant.detail}</p>
          </div>
        </div>
      );
    case "libre":
      return (
        <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
          <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center">
            —
          </span>
          <p>{occupant.label}</p>
        </div>
      );
  }
}

export function PortofoliosRent({ bien, compact = false }: { bien: PortofolioBien; compact?: boolean }) {
  const payment = bien.payment ? portofolioPayments[bien.payment] : null;
  return (
    <div className={cn("flex flex-col", compact ? "items-end gap-0.5 text-right" : "gap-1")}>
      <p className="leading-tight font-bold whitespace-nowrap text-zinc-950 tabular-nums dark:text-zinc-50">
        {formatAmount(bien.forSale ? (bien.salePrice ?? 0) : bien.rent)}
        <span className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">{bien.forSale ? "FCFA · prix de vente" : "FCFA / mois"}</span>
      </p>
      {bien.rentNote ? <span className="text-xs text-zinc-500 dark:text-zinc-400">{bien.rentNote}</span> : null}
      {payment && bien.status === "loue" ? (
        <span
          className={cn(
            "inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap",
            payment.className,
          )}
        >
          <Icon name={payment.icon} className="size-3" />
          {payment.label}
        </span>
      ) : null}
    </div>
  );
}
