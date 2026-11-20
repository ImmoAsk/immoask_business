"use client";

import { useDashboardData } from "../hooks/use_dashboard_data";
import { DashboardActionsReminder } from "./dashboard_actions_reminder";
import { DashboardCardVersement } from "./dashboard_card_versement";
import { DashboardEncaissementCourbe } from "./dashboard_encaissement_courbe";
import { DashboardGreeting } from "./dashboard_greeting";
import { DashboardKpiGrid } from "./dashboard_kpi";
import { DashboardRecentEncaissement } from "./dashboard_recent_encaissement";

/** Owner dashboard: greeting, KPIs, collections chart, next payout, latest payments, reminders. */
export function Dashboard() {
  const { data } = useDashboardData();

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-8">
      <DashboardGreeting greeting={data.greeting} />
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
