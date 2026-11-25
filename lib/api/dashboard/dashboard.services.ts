import type { DashboardData, DashboardQuery } from "@/features/dashboard/types";
import { buildMockDashboard } from "@/mocks/dashboard";

/** Base URL of the ImmoAsk API; without it the services answer with mock data. */
const API_URL = process.env.NEXT_PUBLIC_API_URL;

/** The dashboard for one management contract (or all of them) and one month. */
export async function fetchDashboard(query: DashboardQuery, signal?: AbortSignal): Promise<DashboardData> {
  if (!API_URL) return buildMockDashboard(query);
  const params = new URLSearchParams({ month: query.month });
  if (query.contract) params.set("contract", query.contract);
  const response = await fetch(`${API_URL}/dashboard?${params}`, { signal, credentials: "include" });
  if (!response.ok) throw new Error(`Tableau de bord indisponible (${response.status})`);
  return (await response.json()) as DashboardData;
}
