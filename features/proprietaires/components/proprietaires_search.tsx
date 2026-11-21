import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { proprietairesControl } from "./proprietaires_styles";

export type ProprietairesSearchProps = {
  query: string;
  onQueryChange: (query: string) => void;
  className?: string;
};

/** Live search on name, phone, residence and the owner's properties. */
export function ProprietairesSearch({ query, onQueryChange, className }: ProprietairesSearchProps) {
  return (
    <form role="search" onSubmit={(event) => event.preventDefault()} className={cn("relative min-w-0", className)}>
      <label htmlFor="proprietaires-search" className="sr-only">
        Rechercher un propriétaire
      </label>
      <Icon name="search" className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-zinc-400" />
      <input
        id="proprietaires-search"
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Rechercher un propriétaire, un bien, un téléphone"
        className={cn(proprietairesControl, focusRing, "w-full pr-4 pl-12 placeholder:text-zinc-400")}
      />
    </form>
  );
}
