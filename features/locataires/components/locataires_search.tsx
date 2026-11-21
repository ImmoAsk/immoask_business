import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { locatairesControl } from "./locataires_styles";

export type LocatairesSearchProps = {
  query: string;
  onQueryChange: (query: string) => void;
  className?: string;
};

/** Live search on name, phone (+228…), property, lot and neighbourhood. */
export function LocatairesSearch({ query, onQueryChange, className }: LocatairesSearchProps) {
  return (
    <form role="search" onSubmit={(event) => event.preventDefault()} className={cn("relative min-w-0", className)}>
      <label htmlFor="locataires-search" className="sr-only">
        Rechercher un locataire
      </label>
      <Icon name="search" className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-zinc-400" />
      <input
        id="locataires-search"
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Rechercher par nom, téléphone (+228), lot…"
        className={cn(locatairesControl, focusRing, "w-full pr-4 pl-12 placeholder:text-zinc-400")}
      />
    </form>
  );
}
