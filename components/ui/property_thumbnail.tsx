import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

/** Kind of property; drives the placeholder tile until real photos exist. */
export type PropertyKind = "villa" | "appartement" | "studio" | "terrain" | "immeuble" | "boutique";

export const propertyKinds: Record<PropertyKind, { label: string; icon: IconName; tile: string }> = {
  villa: {
    label: "Villa",
    icon: "home",
    tile: "from-sky-100 to-brand-100 text-brand-700 dark:from-brand-900 dark:to-sky-950 dark:text-brand-100",
  },
  appartement: {
    label: "Appartement",
    icon: "building",
    tile: "from-indigo-50 to-indigo-100 text-indigo-600 dark:from-indigo-950 dark:to-zinc-900 dark:text-indigo-300",
  },
  studio: {
    label: "Studio",
    icon: "sofa",
    tile: "from-violet-50 to-violet-100 text-violet-600 dark:from-violet-950 dark:to-zinc-900 dark:text-violet-300",
  },
  terrain: {
    label: "Terrain",
    icon: "trees",
    tile: "from-lime-50 to-emerald-100 text-emerald-700 dark:from-emerald-950 dark:to-zinc-900 dark:text-emerald-300",
  },
  immeuble: {
    label: "Immeuble",
    icon: "building",
    tile: "from-slate-100 to-slate-200 text-slate-600 dark:from-slate-800 dark:to-zinc-900 dark:text-slate-300",
  },
  boutique: {
    label: "Boutique",
    icon: "store",
    tile: "from-amber-50 to-orange-100 text-orange-600 dark:from-amber-950 dark:to-zinc-900 dark:text-amber-300",
  },
};

export type PropertyThumbnailProps = {
  kind: PropertyKind;
  photoUrl?: string;
  /** Icon only, without the kind caption. */
  compact?: boolean;
  className?: string;
};

/** Property photo, or a tinted tile with the kind's icon when there is none. */
export function PropertyThumbnail({ kind, photoUrl, compact = false, className }: PropertyThumbnailProps) {
  const meta = propertyKinds[kind];
  return (
    <div
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-2xl bg-linear-to-br",
        meta.tile,
        className,
      )}
    >
      {photoUrl ? (
        <Image src={photoUrl} alt="" fill sizes="144px" className="object-cover" />
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
