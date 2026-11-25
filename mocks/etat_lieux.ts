import type { EtatLieuxData, Inventory } from "@/features/etat_lieux/types";

// Placeholder inventories until lib/api/etat_lieux is wired.

const A = "Appartement A4 · Résidence Les Palmiers";
const V = "Villa duplex · Agoè-Nyivé";
const S = "Studio S2 · Résidence Les Palmiers";
const B = "Bureau 2A · Boulevard du 13 Janvier";

const inventories: Inventory[] = [
  {
    id: "inv_0031",
    reference: "INV-2026-0031",
    type: "entree",
    date: "2026-11-20",
    property: A,
    tenant: "Afi Dossou",
    manager: "Kossi Mensah",
    items: [
      { id: "it_01", element: "Canapé 3 places", room: "Salon", kind: "mobilier", condition: "excellent", cost: 185_000, photos: 3 },
      { id: "it_02", element: "Réfrigérateur double porte", room: "Cuisine", kind: "electromenager", condition: "bon", cost: 240_000, photos: 2 },
      { id: "it_03", element: "Climatiseur split", room: "Chambre principale", kind: "climatisation", condition: "bon", cost: null, photos: 2 },
      { id: "it_04", element: "Carrelage", room: "Salon", kind: "murs_sols", condition: "excellent", cost: null, photos: 1 },
    ],
  },
  {
    id: "inv_0032",
    reference: "INV-2026-0032",
    type: "entree",
    date: "2026-11-14",
    property: V,
    tenant: "Koffi Agbodjan",
    manager: "Ama Tettey",
    items: [
      { id: "it_05", element: "Cuisinière à gaz", room: "Cuisine", kind: "electromenager", condition: "moyen", cost: 120_000, photos: 3 },
      { id: "it_06", element: "Matelas 2 places", room: "Chambre 1", kind: "literie", condition: "bon", cost: 95_000, photos: 2 },
      { id: "it_07", element: "Porte d'entrée", room: "Entrée", kind: "menuiserie", condition: "excellent", cost: null, photos: 1 },
    ],
  },
  {
    id: "inv_0027",
    reference: "INV-2026-0027",
    type: "entree",
    date: "2026-05-10",
    property: S,
    tenant: "Yao Kpodar",
    manager: "Kossi Mensah",
    items: [
      { id: "it_08", element: "Réfrigérateur double porte", room: "Cuisine", kind: "electromenager", condition: "bon", cost: 240_000, photos: 2 },
      { id: "it_09", element: "Lit double", room: "Chambre", kind: "literie", condition: "excellent", cost: 150_000, photos: 3 },
      { id: "it_10", element: "Mur de la chambre", room: "Chambre", kind: "murs_sols", condition: "bon", cost: null, photos: 2 },
    ],
  },
  {
    id: "inv_0033",
    reference: "INV-2026-0033",
    type: "sortie",
    date: "2026-11-23",
    property: S,
    tenant: "Yao Kpodar",
    manager: "Kossi Mensah",
    items: [
      { id: "it_11", element: "Réfrigérateur double porte", room: "Cuisine", kind: "electromenager", condition: "endommage", cost: 240_000, photos: 4 },
      { id: "it_12", element: "Lit double", room: "Chambre", kind: "literie", condition: "moyen", cost: 150_000, photos: 3 },
      { id: "it_13", element: "Mur de la chambre", room: "Chambre", kind: "murs_sols", condition: "endommage", cost: 60_000, photos: 3 },
    ],
  },
  {
    id: "inv_0034",
    reference: "INV-2026-0034",
    type: "sortie",
    date: "2026-11-18",
    property: B,
    tenant: "Togo Services SARL",
    manager: "Ama Tettey",
    items: [
      { id: "it_14", element: "Climatiseur split", room: "Bureau principal", kind: "climatisation", condition: "bon", cost: 310_000, photos: 2 },
      { id: "it_15", element: "Fenêtre coulissante", room: "Salle de réunion", kind: "menuiserie", condition: "endommage", cost: 45_000, photos: 3 },
    ],
  },
];

export const mockEtatLieux: EtatLieuxData = {
  asOf: "2026-11-25",
  inventories,
  history: [2, 3, 3, 4, 4],
};
