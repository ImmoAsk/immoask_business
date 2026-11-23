"use client";

import { useState } from "react";
import type { CalendrieView } from "../types";
import { addDays, addMonths, startOfMonth, startOfWeek } from "./calendries_dates";

/** Month / week / day view and the day the view is centred on. */
export function useCalendriesNavigation(asOf: string) {
  const [view, setView] = useState<CalendrieView>("mois");
  const [cursor, setCursor] = useState(asOf);

  const step = (direction: 1 | -1) =>
    setCursor((day) =>
      view === "mois" ? addMonths(day, direction) : addDays(day, view === "semaine" ? 7 * direction : direction),
    );

  return {
    view,
    setView,
    cursor,
    /** First day of the cursor's month / week. */
    month: startOfMonth(cursor),
    weekStart: startOfWeek(cursor),
    previous: () => step(-1),
    next: () => step(1),
    today: () => setCursor(asOf),
    goTo: (day: string, nextView?: CalendrieView) => {
      setCursor(day);
      if (nextView) setView(nextView);
    },
  };
}

export type UseCalendriesNavigationResult = ReturnType<typeof useCalendriesNavigation>;
