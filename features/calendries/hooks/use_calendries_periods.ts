"use client";

import { useState } from "react";
import type { CalendriePeriod, CalendrieReason } from "../types";
import { conflictsWith } from "./calendries_availability";

/** Local time "YYYY-MM-DDTHH:mm", for the "Créé le" column. Called from event handlers only. */
function nowLocal() {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

/**
 * Unavailability periods, editable on the page. Adding refuses any overlap with the property's
 * existing periods, so a property can never be booked twice.
 * Kept in memory for now: wire `add` and `remove` to lib/api/calendriers once the API exists.
 */
export function useCalendriesPeriods(initial: CalendriePeriod[]) {
  const [periods, setPeriods] = useState(initial);

  return {
    periods,
    add: (bienId: string, ranges: [string, string][], reason: CalendrieReason, comment: string) => {
      const conflicts = conflictsWith(periods, bienId, ranges);
      if (conflicts.length > 0) return { ok: false as const, conflicts };
      const createdAt = nowLocal();
      const created = ranges.map(([start, end], index) => ({
        id: `per_${Date.now()}_${index}`,
        bienId,
        start,
        end,
        reason,
        ...(comment.trim() ? { comment: comment.trim() } : {}),
        createdAt,
      }));
      setPeriods((previous) => [...previous, ...created]);
      return { ok: true as const, created };
    },
    remove: (id: string) => setPeriods((previous) => previous.filter((period) => period.id !== id)),
  };
}

export type UseCalendriesPeriodsResult = ReturnType<typeof useCalendriesPeriods>;
