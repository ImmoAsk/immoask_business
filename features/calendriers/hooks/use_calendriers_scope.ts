"use client";

import { useWorkspaceScope } from "@/features/workspace/hooks";
import type { CalendrierBien, CalendrierPeriod } from "../types";

/**
 * The header's management contract: only its properties are listed, counted and shown in the upcoming periods.
 * The calendar keeps its own month navigation, so the header period does not narrow it.
 */
export function useCalendriersInScope(biens: CalendrierBien[], periods: CalendrierPeriod[]) {
  const scope = useWorkspaceScope();
  const scopedBiens = biens.filter((bien) => scope.matchesContract(bien.management.reference));
  const ids = new Set(scopedBiens.map((bien) => bien.id));
  return { biens: scopedBiens, periods: periods.filter((period) => ids.has(period.bienId)) };
}
