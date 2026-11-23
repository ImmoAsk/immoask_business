import { cn } from "@/lib/cn";
import { paymentStatus } from "../hooks/rent_payments_status";
import type { RentPayment } from "../types";
import { RentPaymentsActions } from "./rent_payments_actions";
import { PaidCell, periodLabel, StatusBadge, TenantAvatar } from "./rent_payments_parts";
import type { RentPaymentsRowMenuProps } from "./rent_payments_row_menu";

export type RentPaymentsCardProps = {
  payment: RentPayment;
  asOf: string;
  onAction?: RentPaymentsRowMenuProps["onAction"];
};

/** Compact row for screens without room for the table. */
export function RentPaymentsCard({ payment, asOf, onAction }: RentPaymentsCardProps) {
  const late = paymentStatus(payment, asOf) === "en_retard";
  return (
    <article
      className={cn(
        "flex flex-col gap-3 rounded-2xl p-3",
        late ? "bg-red-50/60 dark:bg-red-950/20" : "hover:bg-zinc-50 dark:hover:bg-white/5",
      )}
    >
      <div className="flex items-center gap-3">
        <TenantAvatar name={payment.tenant.name} late={late} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-zinc-950 dark:text-zinc-50">{payment.tenant.name}</h3>
          <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
            <span className={cn("font-semibold", late ? "text-red-700 dark:text-red-400" : "text-brand-700 dark:text-brand-100")}>
              #{payment.reference}
            </span>{" "}
            · {payment.bien.title}
          </p>
        </div>
        <RentPaymentsActions payment={payment} asOf={asOf} onAction={onAction} />
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
        <div className="min-w-0">
          <p className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">
            Loyer {periodLabel(payment).toLowerCase()} · {new Intl.NumberFormat("fr-FR").format(payment.rent)} FCFA
          </p>
          <PaidCell payment={payment} asOf={asOf} showMethod />
        </div>
        <StatusBadge payment={payment} asOf={asOf} />
      </div>
    </article>
  );
}
