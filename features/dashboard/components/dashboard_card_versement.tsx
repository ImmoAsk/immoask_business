import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatAmount, formatDayMonthYear } from "@/lib/utils/format";
import type { DashboardVersementData, DashboardVersementStatus } from "../types";

const statusLabel: Record<DashboardVersementStatus, string> = {
  valide: "Validé",
  en_attente: "En attente",
  bloque: "Bloqué",
};

export type DashboardCardVersementProps = {
  versement: DashboardVersementData;
  className?: string;
};

export function DashboardCardVersement({ versement, className }: DashboardCardVersementProps) {
  return (
    <section
      aria-label="Prochain versement"
      className={cn(
        "relative overflow-hidden rounded-3xl bg-linear-to-br from-brand-700 to-brand-500 p-7 text-white shadow-[0_12px_30px_-12px_rgba(7,95,147,0.6)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="max-w-32 text-sm font-medium tracking-wide text-white/85 uppercase">Prochain versement</p>
        <Icon name="badgeCheck" className="size-6 text-white/90" />
      </div>
      <p className="mt-1 flex items-baseline gap-2 whitespace-nowrap">
        <span className="text-4xl font-bold tracking-tight tabular-nums">{formatAmount(versement.amount)}</span>
        <span className="text-xl font-medium text-white/90">FCFA</span>
      </p>
      <p className="mt-3 text-[15px] text-white/90">
        {versement.bankName} • {versement.accountHolder}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/20 pt-6">
        <p className="text-[15px] text-white/90">
          Date estimée : <strong className="font-semibold text-white">{formatDayMonthYear(versement.estimatedDate)}</strong>
        </p>
        <span className="rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold">
          {statusLabel[versement.status]}
        </span>
      </div>
    </section>
  );
}
