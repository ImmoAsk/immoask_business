import type { Versement, VersementsData } from "@/features/versements/types";

// Placeholder payouts until lib/api/versements is wired. Account numbers are masked and fictitious.

const contracts = {
  "CG-2026-0001": { reference: "CG-2026-0001", owner: "Mawuli Adjovi", manager: "Kossi Mensah", property: "Résidence Les Palmiers" },
  "CG-2026-0002": { reference: "CG-2026-0002", owner: "Efua Lawson", manager: "Ama Tettey", property: "Villa duplex · Agoè-Nyivé" },
  "CG-2026-0003": { reference: "CG-2026-0003", owner: "Société Immo Kara", manager: "Ama Tettey", property: "Centre commercial Kara" },
  "CG-2026-0004": { reference: "CG-2026-0004", owner: "Yaovi Gbeglo", manager: "Kossi Mensah", property: "Bureaux · Boulevard du 13 Janvier" },
};

type Row = [keyof typeof contracts, Versement["type"], number, Versement["currency"], Versement["method"], string, string, number, string, string];

const rows: Row[] = [
  ["CG-2026-0001", "loyer", 1_850_000, "FCFA", "virement", "2026-11-22", "releve-loyers-novembre.pdf", 188_416, "IBAN •••• 4821", "VIR-8841-2211"],
  ["CG-2026-0002", "loyer", 920_000, "FCFA", "mobile_money", "2026-11-20", "capture-t-money.jpg", 626_688, "T-Money •••• 37 28", "TM-5530917"],
  ["CG-2026-0003", "service", 150_000, "FCFA", "virement", "2026-11-18", "facture-entretien-ascenseur.pdf", 236_544, "IBAN •••• 7710", "VIR-8812-1811"],
  ["CG-2026-0004", "caution", 600_000, "FCFA", "virement", "2026-11-15", "avis-de-virement-caution.pdf", 150_528, "IBAN •••• 2096", "VIR-8790-1511"],
  ["CG-2026-0001", "caution", 450_000, "FCFA", "mobile_money", "2026-11-10", "recu-flooz-caution.jpg", 509_952, "Flooz •••• 91 05", "FZ-7720481"],
  ["CG-2026-0002", "loyer", 1_250, "EUR", "virement", "2026-11-08", "swift-loyer-octobre.pdf", 207_872, "IBAN •••• 5538", "VIR-8744-0811"],
  ["CG-2026-0003", "loyer", 3_200_000, "FCFA", "virement", "2026-10-30", "releve-loyers-octobre.pdf", 180_224, "IBAN •••• 7710", "VIR-8701-3010"],
  ["CG-2026-0004", "service", 85_000, "FCFA", "mobile_money", "2026-10-24", "facture-nettoyage.jpg", 364_544, "T-Money •••• 52 14", "TM-5498830"],
  ["CG-2026-0001", "loyer", 1_850_000, "FCFA", "virement", "2026-10-22", "releve-loyers-octobre.pdf", 185_344, "IBAN •••• 4821", "VIR-8688-2210"],
  ["CG-2026-0002", "caution", 900, "USD", "virement", "2026-10-12", "swift-caution.pdf", 199_680, "IBAN •••• 5538", "VIR-8650-1210"],
];

const versements: Versement[] = rows.map(([contract, type, amount, currency, method, date, name, size, account, transactionRef], index) => ({
  id: `vs_${301 + index}`,
  reference: `VS-2026-${String(301 + index).padStart(4, "0")}`,
  management: contracts[contract],
  type,
  amount,
  currency,
  method,
  account,
  transactionRef,
  date,
  attachment: { name, size },
}));

export const mockVersements: VersementsData = {
  asOf: "2026-11-25",
  versements,
  history: [2, 3, 3, 5, 4],
};
