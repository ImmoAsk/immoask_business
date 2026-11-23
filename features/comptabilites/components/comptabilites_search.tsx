import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { comptabilitesControl } from "./comptabilites_styles";

export type ComptabilitesSearchProps = {
  query: string;
  onQueryChange: (query: string) => void;
  className?: string;
};

/** Live search on description, property, tenant or supplier, category, voucher number and amount. */
export function ComptabilitesSearch({ query, onQueryChange, className }: ComptabilitesSearchProps) {
  return (
    <form role="search" onSubmit={(event) => event.preventDefault()} className={cn("relative min-w-0", className)}>
      <label htmlFor="comptabilites-search" className="sr-only">
        Rechercher une opération
      </label>
      <Icon name="search" className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-zinc-400" />
      <input
        id="comptabilites-search"
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Rechercher une opération, un bien, un locataire…"
        className={cn(comptabilitesControl, focusRing, "w-full pr-4 pl-12 placeholder:text-zinc-400")}
      />
    </form>
  );
}
