import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { rentPaymentsControl } from "./rent_payments_styles";

export type RentPaymentsSearchProps = {
  query: string;
  onQueryChange: (query: string) => void;
  className?: string;
};

/** Live search on tenant, phone, property, lot and payment number (#PAY-…). */
export function RentPaymentsSearch({ query, onQueryChange, className }: RentPaymentsSearchProps) {
  return (
    <form role="search" onSubmit={(event) => event.preventDefault()} className={cn("relative min-w-0", className)}>
      <label htmlFor="rent-payments-search" className="sr-only">
        Rechercher un paiement de loyer
      </label>
      <Icon name="search" className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-zinc-400" />
      <input
        id="rent-payments-search"
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Locataire, téléphone, quittance (#PAY-2025)"
        className={cn(rentPaymentsControl, focusRing, "w-full pr-4 pl-12 placeholder:text-zinc-400")}
      />
    </form>
  );
}
