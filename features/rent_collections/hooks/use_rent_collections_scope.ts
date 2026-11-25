"use client";

import { useWorkspaceScope } from "@/features/workspace/hooks";
import type { RentCollectionsData } from "../types";

/**
 * The header's contract and period: payments on that contract's properties, received (or due) during the month,
 * and last month's rent of the same contracts for the trend.
 */
export function useRentCollectionsInScope(data: RentCollectionsData) {
  const scope = useWorkspaceScope();
  const collections = data.collections.filter(
    (collection) => scope.matchesContract(collection.management.reference) && scope.inPeriod(collection.date),
  );
  const previous = data.previousMonthRents.filter((entry) => scope.matchesContract(entry.management));
  // The trend compares the month in progress with the one before; another month has nothing to compare.
  const showsCurrentMonth = !scope.period || scope.period.value === data.asOf.slice(0, 7);
  return {
    collections,
    previousMonthRent: showsCurrentMonth && previous.length > 0 ? previous.reduce((sum, entry) => sum + entry.amount, 0) : null,
  };
}
