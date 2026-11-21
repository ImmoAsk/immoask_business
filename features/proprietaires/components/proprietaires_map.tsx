"use client";

import Link from "next/link";
import { LomeMap } from "@/components/map";
import type { MapLegendItem, MapMarker, MapMarkerTone } from "@/components/map";
import { Icon } from "@/components/ui/icon";
import { PropertyThumbnail, propertyKinds } from "@/components/ui/property_thumbnail";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import type { Proprietaire, ProprietaireBien, ProprietaireReversementStatus } from "../types";
import { ReversementBadge } from "./proprietaires_parts";
import { reversementStatuses } from "./proprietaires_styles";

const tones: Record<ProprietaireReversementStatus, MapMarkerTone> = {
  a_jour: "brand",
  en_attente: "amber",
  planifie: "deep",
};

const legend: MapLegendItem[] = [
  { label: "Reversement à jour", tone: "brand" },
  { label: "En attente", tone: "amber" },
  { label: "Planifié", tone: "deep" },
  { label: "Mandat suspendu", tone: "outline" },
];

/** Map marker id of a property (property ids are unique across owners). */
export const proprietaireMarkerId = (bien: ProprietaireBien) => bien.id;

export type ProprietairesMapProps = {
  proprietaires: Proprietaire[];
  /** Selected property (marker) id. */
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  /** Owner hovered in the list: all their properties are highlighted. */
  highlightedOwnerId?: string | null;
  onOpen?: (proprietaire: Proprietaire) => void;
  /** Fill the height set by `className`. */
  fill?: boolean;
  className?: string;
};

/** Properties under mandate on the shared Lomé map, colored by their owner's payout status. */
export function ProprietairesMap({
  proprietaires,
  selectedId,
  onSelect,
  highlightedOwnerId,
  onOpen,
  fill,
  className,
}: ProprietairesMapProps) {
  const markers: MapMarker[] = proprietaires.flatMap((proprietaire) =>
    proprietaire.biens.map((bien) => ({
      id: proprietaireMarkerId(bien),
      coordinates: bien.coordinates,
      label: `${bien.title} — ${proprietaire.name} — reversement ${reversementStatuses[proprietaire.reversement.status].label.toLowerCase()}${proprietaire.status === "suspendu" ? " — mandat suspendu" : ""}`,
      place: bien.city,
      tone: proprietaire.status === "suspendu" ? "outline" : tones[proprietaire.reversement.status],
      icon: propertyKinds[bien.kind].icon,
    })),
  );
  const highlightedIds =
    proprietaires.find((proprietaire) => proprietaire.id === highlightedOwnerId)?.biens.map(proprietaireMarkerId) ?? [];

  return (
    <LomeMap
      ariaLabel="Carte des biens sous mandat — Grand Lomé"
      markers={markers}
      selectedId={selectedId}
      onSelect={onSelect}
      highlightedIds={highlightedIds}
      legend={legend}
      fill={fill}
      className={className}
      topLeft={
        <Link
          href="/app/portofolio"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white/95 px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm hover:text-brand-700 dark:border-white/10 dark:bg-zinc-900/95 dark:text-zinc-200 dark:hover:text-brand-100",
            focusRing,
          )}
        >
          Voir tous les biens <Icon name="externalLink" className="size-3.5" />
        </Link>
      }
      renderPopup={(id, close) => {
        const proprietaire = proprietaires.find((owner) => owner.biens.some((bien) => bien.id === id));
        const bien = proprietaire?.biens.find((item) => item.id === id);
        if (!proprietaire || !bien) return null;
        const others = proprietaire.biens.length - 1;
        return (
          <div className="flex gap-3">
            <PropertyThumbnail kind={bien.kind} photoUrl={bien.photoUrl} className="size-24" />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-start gap-2">
                <p className="line-clamp-2 flex-1 text-sm font-semibold text-zinc-950 dark:text-zinc-50">{bien.title}</p>
                <button
                  type="button"
                  aria-label="Fermer"
                  onClick={close}
                  className={cn(
                    "-mt-1 -mr-1 grid size-6 shrink-0 cursor-pointer place-items-center rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200",
                    focusRing,
                  )}
                >
                  <Icon name="close" className="size-3.5" />
                </button>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {bien.city}, {bien.quartier} · {bien.lots} lot{bien.lots > 1 ? "s" : ""}
              </p>
              <p className="text-xs text-zinc-700 dark:text-zinc-300">
                <span className="font-semibold">{proprietaire.name}</span>
                {others > 0 ? ` · +${others} autre${others > 1 ? "s" : ""} bien${others > 1 ? "s" : ""}` : null}
              </p>
              <div>
                <ReversementBadge proprietaire={proprietaire} />
              </div>
              <button
                type="button"
                onClick={() => onOpen?.(proprietaire)}
                className={cn(
                  "mt-1 inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-xl bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 dark:bg-brand-500",
                  focusRing,
                )}
              >
                Voir le propriétaire <Icon name="arrowRight" className="size-3.5" />
              </button>
            </div>
          </div>
        );
      }}
    />
  );
}
