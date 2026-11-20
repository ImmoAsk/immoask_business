import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { PortofolioBien } from "../types";
import {
  PortofoliosFeatures,
  PortofoliosRent,
  PortofoliosStatusBadge,
  PortofoliosThumbnail,
} from "./portofolios_bien_parts";
import type { PortofoliosRowMenuProps } from "./portofolios_row_menu";
import { PortofoliosRowMenu } from "./portofolios_row_menu";

export type PortofoliosBienCardProps = {
  bien: PortofolioBien;
  selected?: boolean;
  /** Click on the card body (the map view selects the pin). */
  onSelect?: (bien: PortofolioBien) => void;
  onHover?: (bien: PortofolioBien | null) => void;
  onAction?: PortofoliosRowMenuProps["onAction"];
};

/** Compact row used by the map view and by the table on small screens. */
export function PortofoliosBienCard({ bien, selected, onSelect, onHover, onAction }: PortofoliosBienCardProps) {
  return (
    <article
      onMouseEnter={() => onHover?.(bien)}
      onMouseLeave={() => onHover?.(null)}
      className={cn(
        "relative flex gap-4 rounded-2xl p-3 transition-colors",
        selected ? "bg-brand-50/70 ring-1 ring-brand-200 dark:bg-brand-900/30 dark:ring-brand-700" : "hover:bg-zinc-50 dark:hover:bg-white/5",
      )}
    >
      <PortofoliosThumbnail bien={bien} className="size-24 sm:size-28" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-zinc-950 dark:text-zinc-50">
              {onSelect ? (
                <button
                  type="button"
                  onClick={() => onSelect(bien)}
                  className="cursor-pointer text-left outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-brand-500"
                >
                  {bien.title}
                </button>
              ) : (
                bien.title
              )}
            </h3>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">Réf. {bien.reference}</p>
          </div>
          <div className="relative z-10 -mt-1 -mr-1">
            <PortofoliosRowMenu bien={bien} onAction={onAction} />
          </div>
        </div>
        <p className="flex items-center gap-1.5 text-sm text-zinc-700 dark:text-zinc-300">
          <Icon name="mapPin" className="size-4 shrink-0 text-zinc-400" />
          <span className="truncate">
            {bien.location.quartier}, {bien.location.city}
            <span className="text-zinc-400"> • {bien.location.zone}</span>
          </span>
        </p>
        <div className="hidden sm:block">
          <PortofoliosFeatures bien={bien} limit={2} />
        </div>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-2">
          <PortofoliosStatusBadge bien={bien} />
          <PortofoliosRent bien={bien} compact />
        </div>
      </div>
    </article>
  );
}
