import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatMonth } from "../hooks/calendriers_dates";
import type { CalendrierKpis } from "../types";
import { calendriersPanel } from "./calendriers_styles";

export type CalendriersKpiProps = { kpis: CalendrierKpis; month: string };

export function CalendriersKpi({ kpis, month }: CalendriersKpiProps) {
  const percent = Math.round(kpis.availablePercent);
  return (
    <section aria-label="Indicateurs de disponibilité" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <Card icon="calendar" tile="bg-brand-50 text-brand-600 dark:bg-brand-900/60 dark:text-brand-100" title="Total de biens" value={kpis.total}>
        biens dans votre patrimoine
      </Card>
      <Card icon="checkCircle" tile="bg-brand-600 text-white dark:bg-brand-500" title="Biens disponibles" value={kpis.available}>
        <strong className="font-semibold text-brand-700 dark:text-brand-100">{percent} %</strong> du portefeuille, aujourd&apos;hui
      </Card>
      <Card icon="lock" tile="bg-brand-900 text-white dark:bg-brand-300 dark:text-brand-950" title="Biens indisponibles" value={kpis.unavailable}>
        <strong className="font-semibold text-zinc-800 dark:text-zinc-100">{100 - percent} %</strong> du portefeuille, aujourd&apos;hui
      </Card>
      <Card icon="clock" tile="bg-brand-100 text-brand-800 dark:bg-brand-800/60 dark:text-brand-100" title="Périodes d'indisponibilité" value={kpis.periodsInMonth}>
        en {formatMonth(month).toLowerCase()}
      </Card>
    </section>
  );
}

function Card({
  icon,
  tile,
  title,
  value,
  children,
}: {
  icon: IconName;
  tile: string;
  title: string;
  value: number;
  children: React.ReactNode;
}) {
  return (
    <article className={cn(calendriersPanel, "flex items-start gap-4 p-5")}>
      <span className={cn("grid size-12 shrink-0 place-items-center rounded-2xl", tile)}>
        <Icon name={icon} className="size-5.5" strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-300">{title}</h2>
        <p className="mt-1 text-3xl leading-tight font-bold text-zinc-950 tabular-nums dark:text-zinc-50">{value}</p>
        <p className="mt-0.5 text-[13px] text-zinc-500 dark:text-zinc-400">{children}</p>
      </div>
    </article>
  );
}
