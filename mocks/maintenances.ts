import type { Maintenance, MaintenancesData } from "@/features/maintenances/types";

// Placeholder repair requests until lib/api/maintenances is wired.

const maintenances: Maintenance[] = [
  { id: "mt_0201", reference: "MT-2026-0201", category: "plomberie", description: "Fuite sous l'évier de la cuisine, eau au sol", property: "Appartement A4 · Résidence Les Palmiers", createdAt: "2026-11-24", status: "nouvelle" },
  { id: "mt_0202", reference: "MT-2026-0202", category: "electricite", description: "Coupures répétées du disjoncteur dans le salon", property: "Villa duplex · Agoè-Nyivé", createdAt: "2026-11-23", status: "nouvelle" },
  { id: "mt_0203", reference: "MT-2026-0203", category: "climatisation", description: "Le climatiseur de la chambre principale ne refroidit plus", property: "Appartement meublé 3B · Bè-Kpota", createdAt: "2026-11-22", status: "en_traitement" },
  { id: "mt_0204", reference: "MT-2026-0204", category: "toiture", description: "Infiltrations d'eau au plafond après les dernières pluies", property: "Bureau 2A · Boulevard du 13 Janvier", createdAt: "2026-11-19", status: "en_traitement" },
  { id: "mt_0205", reference: "MT-2026-0205", category: "serrurerie", description: "Serrure de la porte d'entrée bloquée", property: "Boutique n°3 · Centre commercial Kara", createdAt: "2026-11-18", status: "nouvelle" },
  { id: "mt_0206", reference: "MT-2026-0206", category: "peinture", description: "Reprise de la peinture après un dégât des eaux", property: "Appartement B3 · Résidence Les Palmiers", createdAt: "2026-11-12", status: "en_traitement" },
  { id: "mt_0207", reference: "MT-2026-0207", category: "plomberie", description: "Chasse d'eau qui coule en continu", property: "Studio S2 · Résidence Les Palmiers", createdAt: "2026-11-05", status: "resolue" },
  { id: "mt_0208", reference: "MT-2026-0208", category: "electricite", description: "Remplacement de deux prises défectueuses", property: "Appartement 2 · Bè-Kpota", createdAt: "2026-10-28", status: "resolue" },
  { id: "mt_0209", reference: "MT-2026-0209", category: "climatisation", description: "Entretien annuel et nettoyage des filtres", property: "Bureau 4B · Boulevard du 13 Janvier", createdAt: "2026-10-20", status: "resolue" },
  { id: "mt_0210", reference: "MT-2026-0210", category: "serrurerie", description: "Changement de cylindre après perte de clés", property: "Appartement A1 · Résidence Les Palmiers", createdAt: "2026-10-09", status: "resolue" },
];

export const mockMaintenances: MaintenancesData = {
  asOf: "2026-11-25",
  maintenances,
  newHistory: [1, 2, 1, 2, 2],
};
