"use client";

import { LomeMap } from "@/components/map";
import type { MapLegendItem, MapMarker, MapMarkerTone } from "@/components/map";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { formatAmount } from "@/lib/utils/format";
import type { PortofolioBien, PortofolioBienStatus } from "../types";
import { PortofoliosThumbnail, statusLabel } from "./portofolios_bien_parts";

const tones: Record<PortofolioBienStatus, MapMarkerTone> = {
  loue: "brand",
  vacant: "outline",
  en_travaux: "orange",
};

const legend: MapLegendItem[] = [
  { label: "Loué", tone: "brand" },
  { label: "Vacant", tone: "outline" },
  { label: "En travaux", tone: "orange" },
];

export type PortofoliosMapsProps = {
  biens: PortofolioBien[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  /** Property hovered in the list, drawn larger. */
  highlightedId?: string | null;
  onOpen?: (bien: PortofolioBien) => void;
  className?: string;
};

/** Properties on the shared Lomé map, coloured by status. */
export function PortofoliosMaps({ biens, selectedId, onSelect, highlightedId, onOpen, className }: PortofoliosMapsProps) {
  // Properties without a position are left off the map.
  const markers: MapMarker[] = biens.flatMap((bien) =>
    bien.coordinates
      ? [
          {
            id: bien.id,
            coordinates: bien.coordinates,
            label: `${bien.title} — ${statusLabel(bien)} — ${formatAmount(bien.rent)} FCFA par mois`,
            place: bien.location.city,
            tone: tones[bien.status],
            icon: bien.status === "en_travaux" ? ("wrench" as const) : ("home" as const),
          },
        ]
      : [],
  );

  return (
    <LomeMap
      ariaLabel="Carte des biens — Grand Lomé"
      markers={markers}
      selectedId={selectedId}
      onSelect={onSelect}
      highlightedId={highlightedId}
      legend={legend}
      className={className}
      renderPopup={(id, close) => {
        const bien = biens.find((item) => item.id === id);
        if (!bien) return null;
        return (
          <div className="flex gap-3">
            <PortofoliosThumbnail bien={bien} className="size-20" />
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start gap-2">
                <p className="line-clamp-2 flex-1 text-sm font-semibold text-zinc-950 dark:text-zinc-50">{bien.title}</p>
                <button
                  type="button"
                  aria-label="Fermer"
                  onClick={close}
                  className={cn("-mt-1 -mr-1 grid size-6 shrink-0 cursor-pointer place-items-center rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200", focusRing)}
                >
                  <Icon name="close" className="size-3.5" />
                </button>
              </div>
              <p className="mt-1 text-sm font-semibold text-zinc-800 tabular-nums dark:text-zinc-200">
                {formatAmount(bien.rent)} FCFA/mois
              </p>
              <button
                type="button"
                onClick={() => onOpen?.(bien)}
                className={cn("mt-auto inline-flex w-fit cursor-pointer items-center gap-1 rounded pt-1 text-sm font-semibold text-brand-700 hover:underline dark:text-brand-100", focusRing)}
              >
                Voir détails <Icon name="arrowRight" className="size-3.5" />
              </button>
            </div>
          </div>
        );
      }}
    />
  );
}
