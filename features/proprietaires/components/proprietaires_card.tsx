import { cn } from "@/lib/cn";
import type { Proprietaire } from "../types";
import {
  formatTransferDate,
  PortfolioCell,
  ProprietairesAvatar,
  profileLine,
  ReversementBadge,
  RevenueCell,
} from "./proprietaires_parts";
import type { ProprietairesRowMenuProps } from "./proprietaires_row_menu";
import { ProprietairesRowMenu } from "./proprietaires_row_menu";

export type ProprietairesCardProps = {
  proprietaire: Proprietaire;
  mandateEndingSoon?: boolean;
  selected?: boolean;
  /** Click on the card (the map view selects the owner's properties). */
  onSelect?: (proprietaire: Proprietaire) => void;
  onHover?: (proprietaire: Proprietaire | null) => void;
  onAction?: ProprietairesRowMenuProps["onAction"];
};

/** Compact row: the map-mode list and the table on small screens. */
export function ProprietairesCard({
  proprietaire,
  mandateEndingSoon,
  selected,
  onSelect,
  onHover,
  onAction,
}: ProprietairesCardProps) {
  return (
    <div className="@container">
      <article
        onMouseEnter={() => onHover?.(proprietaire)}
        onMouseLeave={() => onHover?.(null)}
        className={cn(
          "relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-3 rounded-2xl p-3 transition-colors @xl:grid-cols-[auto_minmax(0,1fr)_minmax(0,1.3fr)_auto]",
          selected
            ? "bg-brand-50/70 ring-1 ring-brand-200 dark:bg-brand-900/30 dark:ring-brand-700"
            : "hover:bg-zinc-50 dark:hover:bg-white/5",
        )}
      >
        <ProprietairesAvatar proprietaire={proprietaire} />
        <div className="min-w-0">
          <h3 className="truncate leading-snug font-semibold text-zinc-950 dark:text-zinc-50">
            {onSelect ? (
              <button
                type="button"
                onClick={() => onSelect(proprietaire)}
                className="cursor-pointer text-left outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-brand-500"
              >
                {proprietaire.name}
              </button>
            ) : (
              proprietaire.name
            )}
          </h3>
          <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">{profileLine(proprietaire)}</p>
        </div>

        <div className="relative z-10 col-start-3 row-start-1 @xl:col-start-4">
          <ProprietairesRowMenu proprietaire={proprietaire} mandateEndingSoon={mandateEndingSoon} onAction={onAction} />
        </div>

        <div className="col-span-3 flex min-w-0 items-center justify-between gap-3 @xl:col-span-1 @xl:col-start-3 @xl:row-start-1">
          <PortfolioCell proprietaire={proprietaire} />
          <div className="flex shrink-0 flex-col items-end gap-1.5 text-right">
            <ReversementBadge proprietaire={proprietaire} />
            <div className="hidden @md:block">
              <RevenueCell proprietaire={proprietaire} />
            </div>
            <p className="text-xs text-zinc-500 @md:hidden dark:text-zinc-400">
              {formatTransferDate(proprietaire.reversement.lastTransferDate)}
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
