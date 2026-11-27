"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

/** Kind of property; drives the placeholder tile until real photos exist. */
export type PropertyKind = "villa" | "appartement" | "studio" | "terrain" | "immeuble" | "boutique";

export const propertyKinds: Record<PropertyKind, { label: string; icon: IconName; tile: string }> = {
  villa: {
    label: "Villa",
    icon: "home",
    tile: "from-brand-50 to-brand-100 text-brand-700 dark:from-brand-900 dark:to-brand-950 dark:text-brand-100",
  },
  appartement: {
    label: "Appartement",
    icon: "building",
    tile: "from-brand-100 to-brand-200 text-brand-800 dark:from-brand-800 dark:to-brand-950 dark:text-brand-100",
  },
  studio: {
    label: "Studio",
    icon: "sofa",
    tile: "from-brand-200 to-brand-300 text-brand-900 dark:from-brand-700 dark:to-brand-900 dark:text-brand-50",
  },
  terrain: {
    label: "Terrain",
    icon: "trees",
    tile: "from-zinc-50 to-brand-50 text-brand-600 dark:from-zinc-900 dark:to-brand-950 dark:text-brand-300",
  },
  immeuble: {
    label: "Immeuble",
    icon: "building",
    tile: "from-brand-700 to-brand-900 text-white dark:from-brand-600 dark:to-brand-900 dark:text-white",
  },
  boutique: {
    label: "Boutique",
    icon: "store",
    tile: "from-brand-400 to-brand-600 text-white dark:from-brand-500 dark:to-brand-800 dark:text-white",
  },
};

export type PropertyThumbnailProps = {
  kind: PropertyKind;
  photoUrl?: string;
  /** Icon only, without the kind caption. */
  compact?: boolean;
  className?: string;
};

/** Property photo, or a tinted tile with the kind's icon when there is none (or it fails to load). */
export function PropertyThumbnail({ kind, photoUrl, compact = false, className }: PropertyThumbnailProps) {
  const meta = propertyKinds[kind];
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const photo = photoUrl && photoUrl !== failedUrl ? photoUrl : null;
  return (
    <div
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-2xl bg-linear-to-br",
        meta.tile,
        className,
      )}
    >
      {photo ? (
        <Image src={photo} alt="" fill sizes="144px" className="object-cover" onError={() => setFailedUrl(photo)} />
      ) : (
        <>
          <Icon name={meta.icon} className={cn("opacity-80", compact ? "size-5" : "size-7")} />
          {compact ? null : (
            <span className="absolute bottom-1.5 left-2 text-[10px] font-semibold tracking-wide uppercase opacity-70">
              {meta.label}
            </span>
          )}
        </>
      )}
    </div>
  );
}
