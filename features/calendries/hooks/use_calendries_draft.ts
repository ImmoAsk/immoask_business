"use client";

import { useState } from "react";
import type { CalendrieDraft, CalendrieDraftMode } from "../types";
import { consecutiveRuns } from "./calendries_dates";

const emptyDraft = (mode: CalendrieDraftMode = "continue"): CalendrieDraft => ({
  mode,
  start: "",
  end: "",
  dates: [],
  reason: "reservation",
  comment: "",
});

/**
 * The "Définir une période d'indisponibilité" form. Days clicked on the calendar fill it:
 * continuous mode takes a start then an end, multiple mode toggles each day.
 */
export function useCalendriesDraft() {
  const [draft, setDraft] = useState<CalendrieDraft>(emptyDraft());

  /** Ranges the draft would block, or an error to show. */
  const ranges: [string, string][] =
    draft.mode === "continue"
      ? draft.start && draft.end && draft.end >= draft.start
        ? [[draft.start, draft.end]]
        : []
      : consecutiveRuns(draft.dates);
  const error =
    draft.mode === "continue" && draft.start && draft.end && draft.end < draft.start
      ? "La date de fin doit suivre la date de début."
      : null;

  return {
    draft,
    ranges,
    error,
    update: (patch: Partial<CalendrieDraft>) => setDraft((previous) => ({ ...previous, ...patch })),
    setMode: (mode: CalendrieDraftMode) => setDraft((previous) => ({ ...emptyDraft(mode), reason: previous.reason, comment: previous.comment })),
    pickDay: (day: string) =>
      setDraft((previous) => {
        if (previous.mode === "multiple") {
          const dates = previous.dates.includes(day)
            ? previous.dates.filter((date) => date !== day)
            : [...previous.dates, day].sort();
          return { ...previous, dates };
        }
        // First click (or a click before the start, or after a full range) starts a new range.
        if (!previous.start || previous.end !== previous.start || day < previous.start) {
          return { ...previous, start: day, end: day };
        }
        return { ...previous, end: day };
      }),
    reset: () => setDraft((previous) => emptyDraft(previous.mode)),
  };
}

export type UseCalendriesDraftResult = ReturnType<typeof useCalendriesDraft>;
