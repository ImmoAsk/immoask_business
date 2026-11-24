"use client";

import { useState } from "react";

/** Checked rows, kept across pages and dropped when they leave the results. */
export function useRentAgreementsSelection(visibleIds: string[]) {
  const [checked, setChecked] = useState<ReadonlySet<string>>(() => new Set());
  const selected = visibleIds.filter((id) => checked.has(id));

  return {
    selected,
    isSelected: (id: string) => checked.has(id),
    toggle: (id: string) =>
      setChecked((previous) => {
        const next = new Set(previous);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      }),
    /** Header checkbox: checks every id on the page, or unchecks them if all are checked. */
    togglePage: (pageIds: string[]) =>
      setChecked((previous) => {
        const next = new Set(previous);
        const all = pageIds.every((id) => next.has(id));
        for (const id of pageIds) {
          if (all) next.delete(id);
          else next.add(id);
        }
        return next;
      }),
    clear: () => setChecked(new Set()),
  };
}

export type UseRentAgreementsSelectionResult = ReturnType<typeof useRentAgreementsSelection>;
