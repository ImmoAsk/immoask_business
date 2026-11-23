import type { PropertyKind } from "@/components/ui/property_thumbnail";

export type CalendrieBien = {
  id: string;
  title: string;
  /** e.g. "VD-2041" */
  reference: string;
  kind: PropertyKind;
  quartier: string;
  city: string;
  photoUrl?: string;
};

/** Why a property is blocked. */
export type CalendrieReason = "reservation" | "maintenance" | "sejour_proprietaire" | "autre";

/** Days a property cannot be booked; `start` and `end` are inclusive ISO days "YYYY-MM-DD". */
export type CalendriePeriod = {
  id: string;
  bienId: string;
  start: string;
  end: string;
  reason: CalendrieReason;
  comment?: string;
  /** ISO date-time "YYYY-MM-DDTHH:mm". */
  createdAt: string;
};

export type CalendrieView = "mois" | "semaine" | "jour";

export type CalendrieAvailability = "disponible" | "indisponible";

/** "Période continue" blocks start → end; "Dates multiples" blocks the picked days. */
export type CalendrieDraftMode = "continue" | "multiple";

export type CalendrieDraft = {
  mode: CalendrieDraftMode;
  start: string;
  end: string;
  /** Picked days, sorted (mode "multiple"). */
  dates: string[];
  reason: CalendrieReason;
  comment: string;
};
