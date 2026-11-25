import type { PropertyKind } from "@/components/ui/property_thumbnail";
import type { CalendrierBien, CalendrierPeriod, CalendrierReason, CalendriersData } from "@/features/calendriers/types";

// Placeholder availability until lib/api/calendriers is wired. Today is 23 November 2026.

const bien = (id: string, title: string, reference: string, kind: PropertyKind, quartier: string, city = "Lomé"): CalendrierBien => ({
  id,
  title,
  reference,
  kind,
  quartier,
  city,
});

const biens: CalendrierBien[] = [
  bien("b01", "Villa Duplex 5 Pièces avec Piscine", "VD-2041", "villa", "Cité OUA"),
  bien("b02", "Appartement T3 - La Grâce", "APT-12", "appartement", "Tokoin"),
  bien("b03", "Studio Meublé Baguida", "ST-08", "studio", "Baguida Plage"),
  bien("b04", "Villa Basse Jardin 4P", "VJ-15", "villa", "Agoè Cacavéli"),
  bien("b05", "Appartement F2 Kpalimé", "KPL-01", "appartement", "Kpodzi", "Kpalimé"),
  bien("b06", "Terrain 600 m²", "TR-30", "terrain", "Zanguéra"),
  bien("b07", "Duplex B – Résidence Étoile", "DD-02", "villa", "Nyékonakpoè"),
  bien("b08", "Appartement T4 Palm Beach", "PB-T4", "appartement", "Hédzranawoé"),
  bien("b09", "Local Commercial R1", "LC-R1", "boutique", "Nyékonakpoè"),
  bien("b10", "Boutique Grand Marché", "BGM-04", "boutique", "Grand Marché"),
  bien("b11", "Studio Moderne B2", "ST-B2", "studio", "Agoè Nyivé"),
  bien("b12", "Villa Familiale 6 Pièces", "VF-06", "villa", "Adidogomé"),
  bien("b13", "Bureaux Kégué – Lot 3", "BK-03", "immeuble", "Kégué"),
  bien("b14", "Appartement N°04 – Résidence Tokoin", "APT-04", "appartement", "Tokoin"),
  bien("b15", "Résidence du Golfe – Lot 2", "RG-02", "immeuble", "Bè Kpota"),
  bien("b16", "Villa Totsi", "VT-01", "villa", "Totsi"),
  bien("b17", "Studios Djidjolé", "ST-19", "studio", "Djidjolé"),
  bien("b18", "Appartements Wuiti A2", "AW-02", "appartement", "Wuiti"),
  bien("b19", "Villa de Standing Lomé 2", "VL-11", "villa", "Lomé 2"),
  bien("b20", "Boutique Hédzranawoé", "BT-15", "boutique", "Hédzranawoé"),
  bien("b21", "Studio Adakpamé", "ST-33", "studio", "Adakpamé"),
  bien("b22", "Appartement Logopé", "AL-01", "appartement", "Logopé"),
  bien("b23", "Villa Aného Lagune", "VA-01", "villa", "Lagune", "Aného"),
  bien("b24", "Terrain Loti Avédji", "TR-31", "terrain", "Avédji"),
  bien("b25", "Appartement Kodjoviakopé", "AK-05", "appartement", "Kodjoviakopé"),
  bien("b26", "Studio Nukafu", "SN-02", "studio", "Nukafu"),
];

type Row = [bienId: string, start: string, end: string, reason: CalendrierReason, createdAt: string, comment?: string];

// Dates are "MM-DD" in 2026.
const rows: Row[] = [
  ["b01", "11-03", "11-05", "maintenance", "10-28T09:10", "Entretien de la piscine"],
  ["b01", "11-12", "11-13", "reservation", "11-05T14:32", "Famille Mensah"],
  ["b01", "11-19", "11-21", "reservation", "11-05T14:32", "Séjour d'affaires"],
  ["b01", "11-25", "11-25", "sejour_proprietaire", "11-10T08:00"],
  ["b01", "12-12", "12-21", "reservation", "11-18T10:05", "Client en cours de réservation"],
  ["b02", "12-03", "12-07", "maintenance", "10-28T09:15", "Peinture séjour"],
  ["b02", "11-08", "11-09", "reservation", "11-01T11:20"],
  ["b03", "11-21", "11-26", "reservation", "11-12T16:40", "Vacanciers"],
  ["b03", "12-24", "12-31", "reservation", "11-15T09:00", "Fêtes de fin d'année"],
  ["b04", "12-18", "12-24", "sejour_proprietaire", "10-20T16:45"],
  ["b04", "11-14", "11-16", "reservation", "11-02T10:00"],
  ["b05", "11-20", "11-30", "maintenance", "11-11T08:30", "Réfection de la toiture"],
  ["b07", "11-02", "11-04", "reservation", "10-25T12:00"],
  ["b08", "11-23", "11-24", "reservation", "11-16T18:10"],
  ["b08", "12-10", "12-14", "reservation", "11-19T09:45"],
  ["b09", "11-15", "11-17", "autre", "11-03T15:00", "Inventaire du locataire sortant"],
  ["b11", "12-01", "12-02", "maintenance", "11-20T07:50", "Changement de serrure"],
  ["b12", "11-22", "11-28", "sejour_proprietaire", "11-01T10:30"],
  ["b13", "11-06", "11-07", "maintenance", "10-30T13:20"],
  ["b15", "11-27", "12-03", "reservation", "11-17T11:00"],
  ["b16", "11-10", "11-12", "reservation", "11-02T09:00"],
  ["b19", "12-20", "01-03", "sejour_proprietaire", "11-14T17:30", "Le propriétaire passe les fêtes à Lomé"],
  ["b21", "11-18", "11-19", "autre", "11-10T12:00"],
  ["b23", "11-01", "11-04", "reservation", "10-22T08:15"],
  ["b25", "11-23", "11-25", "maintenance", "11-21T10:10", "Plomberie salle de bain"],
];

const periods: CalendrierPeriod[] = rows.map(([bienId, start, end, reason, createdAt, comment], index) => ({
  id: `per_${index + 1}`,
  bienId,
  start: `2026-${start}`,
  end: `${end < start ? "2027" : "2026"}-${end}`,
  reason,
  ...(comment ? { comment } : {}),
  createdAt: `2026-${createdAt}`,
}));

export const mockCalendriers: CalendriersData = { asOf: "2026-11-23", biens, periods };
