"use client";

import { useEffect, useState } from "react";
import { useWorkspace } from "@/features/workspace/hooks/workspace_context";
import { todayIso } from "@/features/workspace/hooks/workspace_periods";
import { WORKSPACE_ALL } from "@/features/workspace/types";
import { fetchDashboard } from "@/lib/api/dashboard/dashboard.services";
import type { DashboardData } from "../types";

export type UseDashboardDataResult = {
  /** Null until the first answer arrives; kept while the next one loads. */
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
};

/** The last answer, and the header selection it was asked for. */
type Answer = { key: string; data: DashboardData | null; error: string | null };

/**
 * The dashboard for the contract and month picked in the header.
 * "Toute la période" shows the month in progress, since every block is monthly.
 */
export function useDashboardData(): UseDashboardDataResult {
  const { selection, isLoading: workspaceLoading } = useWorkspace();
  const contract = selection.contract === WORKSPACE_ALL ? null : selection.contract;
  const month = selection.period === WORKSPACE_ALL ? null : selection.period;
  const key = `${contract ?? WORKSPACE_ALL}|${month ?? WORKSPACE_ALL}`;
  const [answer, setAnswer] = useState<Answer>({ key: "", data: null, error: null });

  useEffect(() => {
    if (workspaceLoading) return;
    // The current month is read on the client, where the request starts.
    const controller = new AbortController();
    fetchDashboard({ contract, month: month ?? todayIso().slice(0, 7) }, controller.signal)
      .then((data) => setAnswer({ key, data, error: null }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setAnswer((previous) => ({ key, data: previous.data, error: error instanceof Error ? error.message : "Erreur de chargement" }));
      });
    return () => controller.abort();
  }, [contract, month, key, workspaceLoading]);

  return { data: answer.data, isLoading: answer.key !== key, error: answer.key === key ? answer.error : null };
}
