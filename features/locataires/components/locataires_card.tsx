import { PropertyThumbnail } from "@/components/ui/property_thumbnail";
import { cn } from "@/lib/cn";
import { formatAmount } from "@/lib/utils/format";
import type { Locataire } from "../types";
import {
  LocatairesAvatar,
  formatPhone,
  PaymentBadge,
} from "./locataires_parts";
import type { LocatairesRowMenuProps } from "./locataires_row_menu";
import { LocatairesRowMenu } from "./locataires_row_menu";

export type LocatairesCardProps = {
  locataire: Locataire;
  leaseEndingSoon?: boolean;
  selected?: boolean;
  /** Click on the card (the map view selects the pin). */
  onSelect?: (locataire: Locataire) => void;
  onHover?: (locataire: Locataire | null) => void;
  onAction?: LocatairesRowMenuProps["onAction"];
};

/** Compact row: the map-mode list and the table on small screens. */
export function LocatairesCard({
  locataire,
  leaseEndingSoon,
  selected,
  onSelect,
  onHover,
  onAction,
}: LocatairesCardProps) {
  const bien = locataire.bien;
  return (
    <div className="@container">
      <article
        onMouseEnter={() => onHover?.(locataire)}
        onMouseLeave={() => onHover?.(null)}
        className={cn(
          "relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-3 rounded-2xl p-3 transition-colors @xl:grid-cols-[auto_minmax(0,1fr)_minmax(0,1.5fr)_auto]",
          selected
            ? "bg-brand-50/70 ring-1 ring-brand-200 dark:bg-brand-900/30 dark:ring-brand-700"
            : "hover:bg-zinc-50 dark:hover:bg-white/5",
        )}
      >
        <LocatairesAvatar locataire={locataire} className="size-11" />
        <div className="min-w-0">
          <h3 className="leading-snug font-semibold text-zinc-950 dark:text-zinc-50">
            {onSelect ? (
              <button
                type="button"
                onClick={() => onSelect(locataire)}
                className="cursor-pointer text-left outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-brand-500"
              >
                {locataire.name}
              </button>
            ) : (
              locataire.name
            )}
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500 tabular-nums dark:text-zinc-400">
            {formatPhone(locataire.phone)}
          </p>
        </div>

        <div className="relative z-10 col-start-3 row-start-1 @xl:col-start-4">
          <LocatairesRowMenu
            locataire={locataire}
            leaseEndingSoon={leaseEndingSoon}
            onAction={onAction}
          />
        </div>

        <div className="col-span-3 flex min-w-0 items-center gap-3 @xl:col-span-1 @xl:col-start-3 @xl:row-start-1">
          <PropertyThumbnail
            kind={bien.kind}
            photoUrl={bien.photoUrl}
            compact
            className="h-12 w-14 shrink-0 rounded-xl"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {bien.title}
            </p>
            <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
              {bien.city}, {bien.quartier}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <PaymentBadge locataire={locataire} short />
            <p className="text-sm font-bold whitespace-nowrap text-zinc-950 tabular-nums dark:text-zinc-50">
              {formatAmount(locataire.rent)}{" "}
              <span className="text-xs font-medium text-zinc-500">
                FCFA/mois
              </span>
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
