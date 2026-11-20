import type { DashboardActionReminderData } from "./dashboard_action_reminder";
import type { DashboardEncaissementPoint } from "./dashboard_encaissement";
import type { DashboardGreetingData } from "./dashboard_greeting";
import type { DashboardKpiData } from "./dashboard_kpi";
import type { DashboardRecentEncaissementData } from "./dashboard_recent_encaissement";
import type { DashboardVersementData } from "./dashboard_versement";

export type * from "./dashboard_action_reminder";
export type * from "./dashboard_encaissement";
export type * from "./dashboard_greeting";
export type * from "./dashboard_kpi";
export type * from "./dashboard_recent_encaissement";
export type * from "./dashboard_versement";

/** Everything the dashboard page shows. */
export type DashboardData = {
  greeting: DashboardGreetingData;
  kpis: DashboardKpiData[];
  versement: DashboardVersementData;
  /** Monthly history, oldest first (at least 12 months for the quarterly view). */
  encaissements: DashboardEncaissementPoint[];
  recentEncaissements: DashboardRecentEncaissementData[];
  recentEncaissementsTotal: number;
  reminders: DashboardActionReminderData[];
};
