import type { IconName } from "@/components/ui/icon";

export type DashboardKpiTone = "brand" | "deep" | "solid" | "warning";

/** Line under the KPI value; each kind has its own layout. */
export type DashboardKpiFootnote =
  | { kind: "trend"; deltaPercent: number; comparedTo: string }
  | { kind: "alert"; text: string }
  | { kind: "occupancy"; occupied: number; total: number; vacant: number }
  | { kind: "success"; text: string };

export type DashboardKpiData = {
  id: string;
  label: string;
  value: number;
  unit: "FCFA" | "%";
  icon: IconName;
  tone: DashboardKpiTone;
  footnote: DashboardKpiFootnote;
};
