"use client";

import { useState } from "react";
import type { RentCollection } from "../types";

/** Payment shown in the detail panel: the one clicked, or the first visible one. */
export function useRentCollectionsDetail(visible: RentCollection[]) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = visible.find((collection) => collection.id === selectedId) ?? visible[0] ?? null;
  return { selected, select: setSelectedId };
}

export type UseRentCollectionsDetailResult = ReturnType<typeof useRentCollectionsDetail>;
