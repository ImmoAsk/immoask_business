"use client";

import { useState } from "react";
import type { Maintenance } from "../types";
import { nextStatus } from "./maintenances_age";

/**
 * Repair requests, moved along as work starts and ends.
 * Kept in memory for now: wire `advance` to lib/api/maintenances once the API exists.
 */
export function useMaintenancesStore(initial: Maintenance[]) {
  const [maintenances, setMaintenances] = useState(initial);
  return {
    maintenances,
    /** Start work on a new request, or mark one in progress as resolved. */
    advance: (maintenanceId: string) =>
      setMaintenances((previous) =>
        previous.map((maintenance) => {
          const next = maintenance.id === maintenanceId ? nextStatus(maintenance.status) : null;
          return next ? { ...maintenance, status: next } : maintenance;
        }),
      ),
  };
}

export type UseMaintenancesStoreResult = ReturnType<typeof useMaintenancesStore>;
