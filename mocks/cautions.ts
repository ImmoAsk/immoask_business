import type { Caution, CautionsData } from "@/features/cautions/types";

// Placeholder deposits until lib/api/cautions is wired.

type Row = [string, string, string, number, Caution["mode"], number | undefined, number, string, [string, string, number][]];

const rows: Row[] = [
  ["CL-2026-0001", "Afi Dossou", "Appartement A4 · Résidence Les Palmiers", 150_000, "mois", 2, 300_000, "2026-01-12", []],
  ["CL-2026-0002", "Koffi Agbodjan", "Villa duplex · Agoè-Nyivé", 350_000, "mois", 3, 1_050_000, "2026-03-05", [["2026-09-30", "Loyer de septembre", 350_000]]],
  ["CL-2026-0003", "Yao Kpodar", "Studio S2 · Résidence Les Palmiers", 80_000, "montant", undefined, 160_000, "2026-05-10", []],
  ["CL-2026-0004", "Togo Services SARL", "Bureau 2A · Boulevard du 13 Janvier", 500_000, "mois", 3, 1_500_000, "2026-02-01", [["2026-10-31", "Loyer d'octobre", 500_000]]],
  ["CL-2026-0005", "Ama Dogbe", "Boutique n°3 · Centre commercial Kara", 220_000, "montant", undefined, 440_000, "2026-06-18", []],
  ["CL-2026-0006", "Kodjo Ayivi", "Appartement B3 · Résidence Les Palmiers", 180_000, "mois", 2, 360_000, "2026-04-02", [["2026-11-05", "Loyer de novembre", 180_000]]],
  ["CL-2026-0007", "Essi Mensah", "Studio S5 · Bè-Kpota", 90_000, "mois", 1, 90_000, "2026-09-01", []],
  [
    "CL-2026-0008",
    "Komla Atsou",
    "Appartement 2 · Bè-Kpota",
    120_000,
    "montant",
    undefined,
    360_000,
    "2026-01-25",
    [
      ["2026-07-31", "Loyer de juillet", 120_000],
      ["2026-08-31", "Loyer d'août", 120_000],
    ],
  ],
  ["CL-2026-0009", "Martha Quaye", "Villa Lomé 2 · Adidogomé", 400_000, "mois", 3, 1_200_000, "2026-10-15", []],
];

const cautions: Caution[] = rows.map(([reference, tenant, property, monthlyRent, mode, months, amount, depositedAt, withdrawals], index) => ({
  id: `ct_${101 + index}`,
  reference: `CT-2026-${String(101 + index).padStart(4, "0")}`,
  agreement: { reference, tenant, property, monthlyRent },
  mode,
  months,
  amount,
  depositedAt,
  movements: withdrawals.map(([date, label, value], step) => ({ id: `ct_${101 + index}_${step}`, kind: "prelevement", date, label, amount: value })),
}));

export const mockCautions: CautionsData = {
  asOf: "2026-11-25",
  cautions,
  heldHistory: [3_400_000, 4_100_000, 4_300_000, 4_150_000, 4_880_000],
};
