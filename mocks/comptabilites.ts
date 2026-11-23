import type { ComptabiliteOperation, ComptabilitesData } from "@/features/comptabilites/types";

// Placeholder bookkeeping for November 2026 until lib/api/comptabilite is wired. Names are fictitious.

type Row = [
  day: string,
  flow: ComptabiliteOperation["flow"],
  category: ComptabiliteOperation["category"],
  description: string,
  bien: string,
  counterparty: string | null,
  amount: number,
  status: ComptabiliteOperation["status"],
];

const rows: Row[] = [
  // Recettes — loyers (3 780 000)
  ["12", "recette", "loyer", "Loyer - Novembre 2026", "Villa Duplex N°2041", "Komlanvi Agbeko", 650_000, "regle"],
  ["03", "recette", "loyer", "Loyer - Novembre 2026", "Appartement T3, lot 04", "Essi Mensah-Amouzou", 220_000, "regle"],
  ["05", "recette", "loyer", "Loyer - Novembre 2026", "Magasin & Bureaux Grand Marché", "Sè Togolaise de Transit SARL", 1_200_000, "en_attente"],
  ["04", "recette", "loyer", "Loyer - Novembre 2026", "Studio meublé Baguida", "Kodjo Lawson", 160_000, "regle"],
  ["06", "recette", "loyer", "Loyer - Novembre 2026", "Villa Basse Jardin", "Afiwa Kpeglo", 380_000, "regle"],
  ["05", "recette", "loyer", "Loyer - Novembre 2026", "Duplex B, Résidence Étoile", "Yawovi Assiongbon", 500_000, "regle"],
  ["07", "recette", "loyer", "Loyer - Novembre 2026", "Local Commercial R1", "SARL Global Pharma", 450_000, "regle"],
  ["14", "recette", "loyer", "Loyer - Novembre 2026", "Appartement F2, lot 01", "Foli Batale", 220_000, "regle"],
  // Recettes — cautions (580 000)
  ["08", "recette", "caution", "Caution - Nouveau locataire", "Studio Meublé", "Afiia Kpeglo", 300_000, "regle"],
  ["17", "recette", "caution", "Caution - Nouveau locataire", "Appartement Wuiti A2", "Mawuli Fiawoo", 280_000, "regle"],
  // Recettes — charges locatives (490 000)
  ["04", "recette", "charges_locatives", "Charges eau & électricité", "Studio meublé Baguida", "Kodjo Lawson", 120_000, "regle"],
  ["06", "recette", "charges_locatives", "Charges eau", "Appartement T4 Palm Beach", "Kossiwa Amegee", 95_000, "regle"],
  ["09", "recette", "charges_locatives", "Charges électricité", "Bureaux Kégué – Lot 3", "Cabinet Dzifa Conseil", 150_000, "regle"],
  ["15", "recette", "charges_locatives", "Charges communes refacturées", "Immeuble R+2", "Atiavi Tosseu", 125_000, "en_attente"],
  // Dépenses — entretien (500 000)
  ["10", "depense", "entretien", "Réparation climatisation", "Appartement T3", null, 180_000, "en_cours"],
  ["13", "depense", "entretien", "Plomberie - fuite cuisine", "Villa Duplex N°2041", "Plomberie Agbodjan", 120_000, "regle"],
  ["18", "depense", "entretien", "Peinture cage d'escalier", "Immeuble R+2", "Déco Plus Lomé", 200_000, "en_cours"],
  // Dépenses — charges communes (440 000)
  ["05", "depense", "charges_communes", "Charges communes", "Immeuble R+2", null, 75_000, "regle"],
  ["01", "depense", "charges_communes", "Gardiennage - Novembre", "Résidence Palm Beach", "Sécurité Plus SARL", 150_000, "regle"],
  ["11", "depense", "charges_communes", "Électricité parties communes", "Immeuble R+2", "CEET", 125_000, "regle"],
  ["16", "depense", "charges_communes", "Nettoyage parties communes", "Résidence Palm Beach", "Clean Togo", 90_000, "regle"],
  // Dépenses — autres (310 000)
  ["02", "depense", "autre", "Assurance multirisque immeuble", "Immeuble R+2", "NSIA Assurances", 210_000, "regle"],
  ["19", "depense", "autre", "Frais bancaires", "—", "Ecobank Togo", 25_000, "regle"],
  ["20", "depense", "autre", "Frais d'huissier - état des lieux", "Villa Basse Jardin", "Me Amedzro", 75_000, "en_cours"],
];

const operations: ComptabiliteOperation[] = rows.map(
  ([day, flow, category, description, bien, counterparty, amount, status], index) => ({
    id: `op_${index + 1}`,
    reference: `OP-2026-${String(1120 + index).padStart(4, "0")}`,
    date: `2026-11-${day}`,
    flow,
    category,
    description,
    bien,
    ...(counterparty ? { counterparty } : {}),
    amount,
    status,
  }),
);

export const mockComptabilites: ComptabilitesData = {
  asOf: "2026-11-20",
  operations,
  history: [
    { month: "2025-12", income: 3_900_000, expenses: 1_050_000 },
    { month: "2026-01", income: 4_050_000, expenses: 980_000 },
    { month: "2026-02", income: 3_950_000, expenses: 1_200_000 },
    { month: "2026-03", income: 4_100_000, expenses: 1_020_000 },
    { month: "2026-04", income: 4_180_000, expenses: 1_150_000 },
    { month: "2026-05", income: 4_220_000, expenses: 990_000 },
    { month: "2026-06", income: 4_300_000, expenses: 1_080_000 },
    { month: "2026-07", income: 4_150_000, expenses: 1_240_000 },
    { month: "2026-08", income: 4_380_000, expenses: 1_010_000 },
    { month: "2026-09", income: 4_410_000, expenses: 1_090_000 },
    { month: "2026-10", income: 4_470_000, expenses: 1_116_000 },
  ],
  ledger: { assets: 5_420_000, liabilities: 5_420_000 },
};
