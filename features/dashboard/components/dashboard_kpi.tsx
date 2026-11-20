import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatAmount, formatPercent } from "@/lib/utils/format";
import type { DashboardKpiData, DashboardKpiFootnote } from "../types";
import { dashboardPanel, toneText, toneTile } from "./dashboard_styles";

export type DashboardKpiProps = {
  kpi: DashboardKpiData;
  className?: string;
};

export function DashboardKpi({ kpi, className }: DashboardKpiProps) {
  return (
    <article className={cn(dashboardPanel, "flex min-w-0 flex-col gap-4 p-6 xl:p-5 2xl:p-6", className)}>
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-xs leading-5 font-semibold tracking-[0.12em] text-zinc-500 uppercase dark:text-zinc-400">
          {kpi.label}
        </h2>
        <span className={cn("grid size-11 shrink-0 place-items-center rounded-2xl", toneTile[kpi.tone])}>
          <Icon name={kpi.icon} className="size-5" />
        </span>
      </div>
      <p className="flex items-baseline gap-1.5 whitespace-nowrap">
        <span className="text-3xl font-bold tracking-tight text-zinc-950 tabular-nums xl:text-[26px] 2xl:text-3xl dark:text-zinc-50">
          {kpi.unit === "%" ? formatPercent(kpi.value) : formatAmount(kpi.value)}
        </span>
        {kpi.unit === "FCFA" ? (
          <span className="text-base font-medium text-zinc-400">FCFA</span>
        ) : null}
      </p>
      <KpiFootnote footnote={kpi.footnote} tone={kpi.tone} />
    </article>
  );
}

function KpiFootnote({ footnote, tone }: { footnote: DashboardKpiFootnote; tone: DashboardKpiData["tone"] }) {
  switch (footnote.kind) {
    case "trend": {
      const up = footnote.deltaPercent >= 0;
      return (
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span className={cn("inline-flex items-center gap-1.5 font-medium", up ? "text-emerald-600" : "text-red-600")}>
            <Icon name="trendUp" className={cn("size-4", !up && "-scale-y-100")} />
            {up ? "+" : ""}
            {footnote.deltaPercent.toLocaleString("fr-FR")}% ce mois
          </span>
          <span className="text-zinc-400">vs {footnote.comparedTo}</span>
        </p>
      );
    }
    case "alert":
      return (
        <p className={cn("flex items-center gap-1.5 text-sm font-medium", toneText[tone])}>
          <Icon name="clock" className="size-4 shrink-0" />
          {footnote.text}
        </p>
      );
    case "occupancy":
      return (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          <span className={cn("font-semibold", toneText[tone])}>
            {footnote.occupied} sur {footnote.total}
          </span>{" "}
          lots occupés • {footnote.vacant} vacant{footnote.vacant > 1 ? "s" : ""}
        </p>
      );
    case "success":
      return (
        <p className={cn("flex items-center gap-1.5 text-sm font-medium", toneText[tone])}>
          <Icon name="checkCircle" className="size-4 shrink-0" />
          {footnote.text}
        </p>
      );
  }
}

export type DashboardKpiGridProps = {
  kpis: DashboardKpiData[];
};

export function DashboardKpiGrid({ kpis }: DashboardKpiGridProps) {
  return (
    <section aria-label="Indicateurs clés" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <DashboardKpi key={kpi.id} kpi={kpi} />
      ))}
    </section>
  );
}
