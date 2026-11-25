import type { ComptabiliteContractMonth, ComptabiliteMonthTotals, ComptabiliteOperation, ComptabilitesData } from "@/features/comptabilites/types";
import { mockManagementAgreements } from "./management_agreements";

// Placeholder bookkeeping for November 2026 until lib/api/comptabilite is wired. Names are fictitious.
// Each operation, closed month and balance sheet belongs to one management contract's books.

type Row = [
  day: string,
  flow: ComptabiliteOperation["flow"],
  category: ComptabiliteOperation["category"],
  description: string,
  bien: string,
  /** Management contract whose books carry the operation. */
  management: string,
  counterparty: string | null,
  amount: number,
  status: ComptabiliteOperation["status"],
];

const rows: Row[] = [
  // Recettes — loyers (3 780 000)
  ["12", "recette", "loyer", "Loyer - Novembre 2026", "Villa Duplex N°2041", "CG-2026-0002", "Komlanvi Agbeko", 650_000, "regle"],
  ["03", "recette", "loyer", "Loyer - Novembre 2026", "Appartement T3, lot 04", "CG-2026-0001", "Essi Mensah-Amouzou", 220_000, "regle"],
  ["05", "recette", "loyer", "Loyer - Novembre 2026", "Magasin & Bureaux Grand Marché", "CG-2026-0003", "Sè Togolaise de Transit SARL", 1_200_000, "en_attente"],
  ["04", "recette", "loyer", "Loyer - Novembre 2026", "Studio meublé Baguida", "CG-2026-0005", "Kodjo Lawson", 160_000, "regle"],
  ["06", "recette", "loyer", "Loyer - Novembre 2026", "Villa Basse Jardin", "CG-2026-0002", "Afiwa Kpeglo", 380_000, "regle"],
  ["05", "recette", "loyer", "Loyer - Novembre 2026", "Duplex B, Résidence Étoile", "CG-2026-0001", "Yawovi Assiongbon", 500_000, "regle"],
  ["07", "recette", "loyer", "Loyer - Novembre 2026", "Local Commercial R1", "CG-2026-0003", "SARL Global Pharma", 450_000, "regle"],
  ["14", "recette", "loyer", "Loyer - Novembre 2026", "Appartement F2, lot 01", "CG-2026-0005", "Foli Batale", 220_000, "regle"],
  // Recettes — cautions (580 000)
  ["08", "recette", "caution", "Caution - Nouveau locataire", "Studio Meublé", "CG-2026-0005", "Afiia Kpeglo", 300_000, "regle"],
  ["17", "recette", "caution", "Caution - Nouveau locataire", "Appartement Wuiti A2", "CG-2026-0005", "Mawuli Fiawoo", 280_000, "regle"],
  // Recettes — charges locatives (490 000)
  ["04", "recette", "charges_locatives", "Charges eau & électricité", "Studio meublé Baguida", "CG-2026-0005", "Kodjo Lawson", 120_000, "regle"],
  ["06", "recette", "charges_locatives", "Charges eau", "Appartement T4 Palm Beach", "CG-2026-0001", "Kossiwa Amegee", 95_000, "regle"],
  ["09", "recette", "charges_locatives", "Charges électricité", "Bureaux Kégué – Lot 3", "CG-2026-0007", "Cabinet Dzifa Conseil", 150_000, "regle"],
  ["15", "recette", "charges_locatives", "Charges communes refacturées", "Immeuble R+2", "CG-2026-0005", "Atiavi Tosseu", 125_000, "en_attente"],
  // Dépenses — entretien (500 000)
  ["10", "depense", "entretien", "Réparation climatisation", "Appartement T3", "CG-2026-0001", null, 180_000, "en_cours"],
  ["13", "depense", "entretien", "Plomberie - fuite cuisine", "Villa Duplex N°2041", "CG-2026-0002", "Plomberie Agbodjan", 120_000, "regle"],
  ["18", "depense", "entretien", "Peinture cage d'escalier", "Immeuble R+2", "CG-2026-0005", "Déco Plus Lomé", 200_000, "en_cours"],
  // Dépenses — charges communes (440 000)
  ["05", "depense", "charges_communes", "Charges communes", "Immeuble R+2", "CG-2026-0005", null, 75_000, "regle"],
  ["01", "depense", "charges_communes", "Gardiennage - Novembre", "Résidence Palm Beach", "CG-2026-0001", "Sécurité Plus SARL", 150_000, "regle"],
  ["11", "depense", "charges_communes", "Électricité parties communes", "Immeuble R+2", "CG-2026-0005", "CEET", 125_000, "regle"],
  ["16", "depense", "charges_communes", "Nettoyage parties communes", "Résidence Palm Beach", "CG-2026-0001", "Clean Togo", 90_000, "regle"],
  // Dépenses — autres (310 000)
  ["02", "depense", "autre", "Assurance multirisque immeuble", "Immeuble R+2", "CG-2026-0005", "NSIA Assurances", 210_000, "regle"],
  ["19", "depense", "autre", "Frais bancaires", "—", "CG-2026-0001", "Ecobank Togo", 25_000, "regle"],
  ["20", "depense", "autre", "Frais d'huissier - état des lieux", "Villa Basse Jardin", "CG-2026-0002", "Me Amedzro", 75_000, "en_cours"],
];

const operations: ComptabiliteOperation[] = rows.map(
  ([day, flow, category, description, bien, management, counterparty, amount, status], index) => ({
    id: `op_${index + 1}`,
    reference: `OP-2026-${String(1120 + index).padStart(4, "0")}`,
    date: `2026-11-${day}`,
    flow,
    category,
    description,
    bien,
    management: { reference: management },
    ...(counterparty ? { counterparty } : {}),
    amount,
    status,
  }),
);

/** Agency-wide closed months, split below between the contracts running each month. */
const agencyHistory: ComptabiliteMonthTotals[] = [
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
];

/** Relative size of each contract's books, close to its share of November's income so the trends stay plausible. */
const weights: Record<string, number> = {
  "CG-2026-0001": 17,
  "CG-2026-0002": 21,
  "CG-2026-0003": 34,
  "CG-2026-0005": 25,
  "CG-2026-0006": 6,
  "CG-2026-0007": 3,
};

/** Contracts signed by the end of the month and not ended before it; the first contract carries the months before any. */
function runningIn(month: string) {
  const running = mockManagementAgreements.agreements
    .filter((agreement) => weights[agreement.reference] && agreement.signedAt <= `${month}-31` && (!agreement.termination || agreement.termination.date >= `${month}-01`))
    .map((agreement) => agreement.reference);
  return running.length > 0 ? running : ["CG-2026-0001"];
}

/** Splits an amount by weight, rounded to the thousand; the first share absorbs the rounding so the total is kept. */
function split(amount: number, references: string[]) {
  const total = references.reduce((sum, reference) => sum + weights[reference], 0);
  const shares = references.map((reference) => Math.round((amount * weights[reference]) / total / 1000) * 1000);
  shares[0] += amount - shares.reduce((sum, share) => sum + share, 0);
  return shares;
}

const history: ComptabiliteContractMonth[] = agencyHistory.flatMap(({ month, income, expenses }) => {
  const references = runningIn(month);
  const incomes = split(income, references);
  const costs = split(expenses, references);
  return references.map((management, index) => ({ management, month, income: incomes[index], expenses: costs[index] }));
});

const ledgerContracts = runningIn("2026-11");
const ledgerShares = split(5_420_000, ledgerContracts);

export const mockComptabilites: ComptabilitesData = {
  asOf: "2026-11-20",
  operations,
  history,
  ledgers: ledgerContracts.map((management, index) => ({ management, assets: ledgerShares[index], liabilities: ledgerShares[index] })),
};
