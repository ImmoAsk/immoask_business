import type { PropertyKind } from "@/components/ui/property_thumbnail";

export type CalendrierBien = {
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
export type CalendrierReason = "reservation" | "maintenance" | "sejour_proprietaire" | "autre";

/** Days a property cannot be booked; `start` and `end` are inclusive ISO days "YYYY-MM-DD". */
export type CalendrierPeriod = {
  id: string;
  bienId: string;
  start: string;
  end: string;
  reason: CalendrierReason;
  comment?: string;
  /** ISO date-time "YYYY-MM-DDTHH:mm". */
  createdAt: string;
};

export type CalendrierView = "mois" | "semaine" | "jour";

export type CalendrierAvailability = "disponible" | "indisponible";

/** "Période continue" blocks start → end; "Dates multiples" blocks the picked days. */
export type CalendrierDraftMode = "continue" | "multiple";

export type CalendrierDraft = {
  mode: CalendrierDraftMode;
  start: string;
  end: string;
  /** Picked days, sorted (mode "multiple"). */
  dates: string[];
  reason: CalendrierReason;
  comment: string;
};
