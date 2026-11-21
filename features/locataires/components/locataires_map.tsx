"use client";

import Link from "next/link";
import { LomeMap } from "@/components/map";
import type { MapLegendItem, MapMarker } from "@/components/map";
import { Icon } from "@/components/ui/icon";
import { PropertyThumbnail } from "@/components/ui/property_thumbnail";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { formatAmount } from "@/lib/utils/format";
import { isLeaseEndingSoon } from "../hooks/locataires_dates";
import type { Locataire } from "../types";
import { PaymentBadge, paymentLabel } from "./locataires_parts";

const legend: MapLegendItem[] = [
  { label: "À jour", tone: "brand" },
  { label: "En retard", tone: "amber" },
  { label: "Fin de bail proche", tone: "deep" },
];

export type LocatairesMapProps = {
  locataires: Locataire[];
  asOf: string;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  highlightedId?: string | null;
  onOpen?: (locataire: Locataire) => void;
  /** Fill the height set by `className`. */
  fill?: boolean;
  className?: string;
};

/** Tenants placed on their property, on the shared Lomé map. */
export function LocatairesMap({
  locataires,
  asOf,
  selectedId,
  onSelect,
  highlightedId,
  onOpen,
  fill,
  className,
}: LocatairesMapProps) {
  const markers: MapMarker[] = locataires.map((locataire) => {
    const late = locataire.payment.status === "en_retard";
    const ending = isLeaseEndingSoon(locataire.lease.endDate, asOf);
    return {
      id: locataire.id,
      coordinates: locataire.bien.coordinates,
      label: `${locataire.name} — ${locataire.bien.title} — ${paymentLabel(locataire)}${ending ? " — fin de bail proche" : ""}`,
      place: locataire.bien.city,
      tone: late ? "amber" : ending ? "deep" : "brand",
      icon: late ? "alert" : ending ? "calendar" : "home",
    };
  });

  return (
    <LomeMap
      ariaLabel="Carte des locataires — Grand Lomé"
      markers={markers}
      selectedId={selectedId}
      onSelect={onSelect}
      highlightedId={highlightedId}
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
        const locataire = locataires.find((item) => item.id === id);
        if (!locataire) return null;
        return (
          <div className="flex gap-3">
            <PropertyThumbnail kind={locataire.bien.kind} photoUrl={locataire.bien.photoUrl} className="size-24" />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-start gap-2">
                <p className="line-clamp-2 flex-1 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                  {locataire.bien.title}
                </p>
                <button
                  type="button"
                  aria-label="Fermer"
                  onClick={close}
                  className={cn("-mt-1 -mr-1 grid size-6 shrink-0 cursor-pointer place-items-center rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200", focusRing)}
                >
                  <Icon name="close" className="size-3.5" />
                </button>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {locataire.bien.city}, {locataire.bien.quartier} · {locataire.name}
              </p>
              <div>
                <PaymentBadge locataire={locataire} />
              </div>
              <p className="text-sm font-semibold text-zinc-800 tabular-nums dark:text-zinc-200">
                {formatAmount(locataire.rent)} FCFA/mois
              </p>
              <button
                type="button"
                onClick={() => onOpen?.(locataire)}
                className={cn(
                  "mt-1 inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-xl bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 dark:bg-brand-500",
                  focusRing,
                )}
              >
                Voir le détail <Icon name="arrowRight" className="size-3.5" />
              </button>
            </div>
          </div>
        );
      }}
    />
  );
}
