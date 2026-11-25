"use client";

import { useState } from "react";
import type { CalendrierAvailability, CalendrierBien, CalendrierPeriod } from "../types";
import { availabilityOn } from "./calendriers_availability";

function normalize(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

/** Property list: search, availability filter (today) and the selected property. */
export function useCalendriersBiens(biens: CalendrierBien[], periods: CalendrierPeriod[], asOf: string) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<CalendrierAvailability | "tous">("tous");
  const [selectedId, setSelectedId] = useState(biens[0]?.id ?? null);

  const terms = normalize(query).split(/\s+/).filter(Boolean);
  const results = biens.filter((bien) => {
    const text = normalize(`${bien.title} ${bien.reference} ${bien.quartier} ${bien.city}`);
    if (!terms.every((term) => text.includes(term))) return false;
    return filter === "tous" || availabilityOn(periods, bien.id, asOf) === filter;
  });

  return {
    query,
    setQuery,
    filter,
    setFilter,
    results,
    selected: biens.find((bien) => bien.id === selectedId) ?? null,
    select: setSelectedId,
    availabilityToday: (bienId: string) => availabilityOn(periods, bienId, asOf),
  };
}

export type UseCalendriersBiensResult = ReturnType<typeof useCalendriersBiens>;
