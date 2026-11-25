"use client";

import { WorkspaceScopeNotice } from "@/features/workspace/components";
import { cn } from "@/lib/cn";
import { useDashboardData } from "../hooks/use_dashboard_data";
import { DashboardActionsReminder } from "./dashboard_actions_reminder";
import { DashboardCardVersement } from "./dashboard_card_versement";
import { DashboardEncaissementCourbe } from "./dashboard_encaissement_courbe";
import { DashboardGreeting } from "./dashboard_greeting";
import { DashboardKpiGrid } from "./dashboard_kpi";
import { DashboardRecentEncaissement } from "./dashboard_recent_encaissement";
import { dashboardPanel } from "./dashboard_styles";

/**
 * Owner dashboard: greeting, KPIs, collections chart, next payout, latest payments, reminders.
 * Every block follows the management contract and month picked in the header.
 */
export function Dashboard() {
  const { data, isLoading, error } = useDashboardData();

  if (!data) {
    return error ? (
      <p role="alert" className={cn(dashboardPanel, "mx-auto max-w-[1400px] p-6 text-sm text-zinc-600 dark:text-zinc-300")}>
        {error}
      </p>
    ) : (
      <DashboardSkeleton />
    );
  }

  return (
    // The previous figures stay on screen, dimmed, while the next selection loads.
    <div aria-busy={isLoading} className={cn("mx-auto flex max-w-[1400px] flex-col gap-8 transition-opacity", isLoading && "opacity-60")}>
      <div className="flex flex-col gap-3">
        <DashboardGreeting greeting={data.greeting} />
        <WorkspaceScopeNotice className="self-start" />
      </div>
      <DashboardKpiGrid kpis={data.kpis} />

      <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="flex min-w-0 flex-col gap-8">
          <DashboardEncaissementCourbe points={data.encaissements} />
          <DashboardRecentEncaissement
            encaissements={data.recentEncaissements}
            total={data.recentEncaissementsTotal}
            month={data.greeting.month}
          />
        </div>
        <div className="flex flex-col gap-8">
          <DashboardCardVersement versement={data.versement} />
          <DashboardActionsReminder reminders={data.reminders} />
        </div>
      </div>
    </div>
  );
}

/** Placeholder blocks while the first dashboard loads. */
function DashboardSkeleton() {
  const block = "animate-pulse rounded-3xl bg-zinc-200/70 dark:bg-white/5";
  return (
    <div aria-busy="true" aria-label="Chargement du tableau de bord" className="mx-auto flex max-w-[1400px] flex-col gap-8">
      <div className={cn(block, "h-20 max-w-xl")} />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className={cn(block, "h-40")} />
        ))}
      </div>
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className={cn(block, "h-96")} />
        <div className={cn(block, "h-96")} />
      </div>
    </div>
  );
}
