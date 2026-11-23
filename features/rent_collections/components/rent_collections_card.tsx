import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/utils/dates";
import { collectionTotal } from "../hooks/rent_collections_money";
import type { RentCollection } from "../types";
import { Fcfa, NatureBadge, StatusBadge, TenantAvatar } from "./rent_collections_parts";

export type RentCollectionsCardProps = {
  collection: RentCollection;
  selected?: boolean;
  onSelect?: (collection: RentCollection) => void;
};

/** Compact row for small screens. */
export function RentCollectionsCard({ collection, selected, onSelect }: RentCollectionsCardProps) {
  return (
    <article
      className={cn(
        "relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2.5 rounded-2xl p-3 transition-colors",
        selected
          ? "bg-brand-50/70 ring-1 ring-brand-200 dark:bg-brand-900/30 dark:ring-brand-700"
          : "hover:bg-zinc-50 dark:hover:bg-white/5",
      )}
    >
      <TenantAvatar name={collection.tenant.name} />
      <div className="min-w-0">
        <h3 className="truncate font-semibold text-zinc-950 dark:text-zinc-50">
          <button
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect?.(collection)}
            className="cursor-pointer text-left outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-brand-500"
          >
            {collection.tenant.name}
          </button>
        </h3>
        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
          <span className="font-semibold text-brand-700 dark:text-brand-100">#{collection.reference}</span> ·{" "}
          {formatShortDate(collection.date)}
        </p>
      </div>
      <Fcfa amount={collectionTotal(collection)} />
      <div className="col-span-3 flex min-w-0 items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm text-zinc-700 dark:text-zinc-300">{collection.bien.title}</p>
          <div className="mt-1 flex">
            <NatureBadge collection={collection} />
          </div>
        </div>
        <StatusBadge collection={collection} />
      </div>
    </article>
  );
}
