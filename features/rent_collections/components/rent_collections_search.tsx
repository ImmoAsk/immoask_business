import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { rentCollectionsControl } from "./rent_collections_styles";

export type RentCollectionsSearchProps = {
  query: string;
  onQueryChange: (query: string) => void;
  className?: string;
};

/** Live search on tenant, phone, property, receipt number (#ENC-…) and transaction id. */
export function RentCollectionsSearch({ query, onQueryChange, className }: RentCollectionsSearchProps) {
  return (
    <form role="search" onSubmit={(event) => event.preventDefault()} className={cn("relative min-w-0", className)}>
      <label htmlFor="rent-collections-search" className="sr-only">
        Rechercher un encaissement
      </label>
      <Icon name="search" className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-zinc-400" />
      <input
        id="rent-collections-search"
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Locataire, bien, quittance (#ENC-2026)"
        className={cn(rentCollectionsControl, focusRing, "w-full pr-4 pl-12 placeholder:text-zinc-400")}
      />
    </form>
  );
}
