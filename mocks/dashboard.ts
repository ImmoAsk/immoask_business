import { remainingAmount } from "@/features/cautions/hooks/cautions_balance";
import type {
  DashboardActionReminderData,
  DashboardData,
  DashboardEncaissementStatus,
  DashboardQuery,
  DashboardRecentEncaissementData,
} from "@/features/dashboard/types";
import type { ManagementAgreement } from "@/features/management_agreements/types";
import { createWorkspaceScope } from "@/features/workspace/hooks/workspace_scope";
import { WORKSPACE_ALL } from "@/features/workspace/types";
import { formatAmount, MONTHS_LONG, parseMonth } from "@/lib/utils/format";
import { mockCautions } from "./cautions";
import { mockEtatLieux } from "./etat_lieux";
import { mockMaintenances } from "./maintenances";
import { mockManagementAgreements } from "./management_agreements";
import { mockRentAgreements } from "./rent_agreements";
import { mockWorkspaceContracts } from "./workspace";

// Stand-in for GET /dashboard?contract=&month= until lib/api/dashboard is wired.
// Figures are derived from the other screens' mock data, so the dashboard and those screens tell the same story.

/** Today in the mocks: the month in progress is still being collected. */
const AS_OF_MONTH = "2026-11";

const pad = (value: number) => String(value).padStart(2, "0");
const monthStart = (month: string) => `${month}-01`;
const monthEnd = (month: string) => {
  const { year, monthIndex } = parseMonth(month);
  return `${month}-${pad(new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate())}`;
};
const addMonths = (month: string, delta: number) => {
  const { year, monthIndex } = parseMonth(month);
  const date = new Date(Date.UTC(year, monthIndex + delta, 1));
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}`;
};

/** Stable pseudo-random 0–99 for a key, so the same contract and month always give the same figures. */
function hash(key: string) {
  let value = 0;
  for (const char of key) value = (value * 31 + char.charCodeAt(0)) % 9973;
  return value % 100;
}

function isActive(agreement: ManagementAgreement, month: string) {
  return agreement.startDate <= monthEnd(month) && (!agreement.termination || agreement.termination.date >= monthStart(month));
}

/** Rent collected on a contract in a month: 86–100 % of what is due, less while the month is still running. */
function collectedOn(agreement: ManagementAgreement, month: string) {
  if (!isActive(agreement, month)) return 0;
  const rate = (86 + (hash(agreement.reference + month) % 15)) / 100;
  const running = month === AS_OF_MONTH ? 0.9 : 1;
  return Math.round((agreement.monthlyRents * rate * running) / 1000) * 1000;
}

function commission(agreement: ManagementAgreement, collected: number) {
  if (collected === 0) return 0;
  return agreement.remuneration.mode === "pourcentage" ? Math.round((collected * agreement.remuneration.percent) / 100) : agreement.remuneration.amount;
}

const METHODS = ["Mixx by Yas", "Flooz", "Virement Ecobank", "Virement Orabank", "T-Money"];
const STATUSES: DashboardEncaissementStatus[] = ["paye", "paye", "paye", "paye", "en_attente", "en_retard"];

export function buildMockDashboard({ contract, month }: DashboardQuery): DashboardData {
  const scope = createWorkspaceScope({ contract: contract ?? WORKSPACE_ALL, period: month }, mockWorkspaceContracts);
  const agreements = mockManagementAgreements.agreements.filter((agreement) => !contract || agreement.reference === contract);
  const active = agreements.filter((agreement) => isActive(agreement, month));
  const monthName = MONTHS_LONG[parseMonth(month).monthIndex];
  const previous = addMonths(month, -1);

  const due = active.reduce((sum, agreement) => sum + agreement.monthlyRents, 0);
  const collected = agreements.reduce((sum, agreement) => sum + collectedOn(agreement, month), 0);
  const collectedBefore = agreements.reduce((sum, agreement) => sum + collectedOn(agreement, previous), 0);
  const net = active.reduce((sum, agreement) => sum + collectedOn(agreement, month) - commission(agreement, collectedOn(agreement, month)), 0);
  const units = active.reduce((sum, agreement) => sum + agreement.biensCount, 0);
  const vacant = active.reduce((sum, agreement) => sum + Math.floor((agreement.biensCount * (hash(agreement.reference) % 12)) / 100), 0);

  // Leases of those contracts running in the month, as the latest payments.
  const leases = mockRentAgreements.agreements.filter(
    (lease) => scope.matchesContract(lease.management.reference) && scope.overlapsPeriod(lease.startDate, lease.termination?.date ?? lease.endDate),
  );
  const recent: DashboardRecentEncaissementData[] = leases.map((lease) => {
    const status = month < AS_OF_MONTH ? "paye" : STATUSES[hash(lease.reference + month) % STATUSES.length];
    const [propertyName, location = ""] = lease.property.split(" · ");
    return {
      id: `${lease.id}_${month}`,
      tenantName: lease.tenant,
      propertyName,
      location,
      amount: lease.amount,
      method: METHODS[hash(lease.reference) % METHODS.length],
      status,
      receiptUrl: status === "paye" ? "#" : undefined,
    };
  });
  const toRemind = recent.filter((line) => line.status !== "paye").length;

  // Reminders from the other screens, narrowed the same way.
  const inventories = mockEtatLieux.inventories.filter((inventory) => scope.matchesProperty(inventory.property) && scope.inPeriod(inventory.date));
  const cautions = mockCautions.cautions.filter((caution) => scope.matchesProperty(caution.agreement.property) && scope.overlapsPeriod(caution.depositedAt));
  const repairs = mockMaintenances.maintenances.filter(
    (maintenance) => scope.matchesProperty(maintenance.property) && scope.inPeriod(maintenance.createdAt),
  );
  const openRepairs = repairs.filter((maintenance) => maintenance.status !== "resolue");
  const latestInventory = inventories.toSorted((a, b) => b.date.localeCompare(a.date))[0];

  const reminders: DashboardActionReminderData[] = [
    latestInventory
      ? {
          id: "etat_lieux",
          icon: "clipboardCheck",
          tone: "brand",
          title: `État des lieux ${latestInventory.type === "entree" ? "d'entrée" : "de sortie"}`,
          description: `${latestInventory.property.split(" · ")[0]} • ${latestInventory.tenant}`,
          meta: `${inventories.length} inventaire${inventories.length > 1 ? "s" : ""} ce mois`,
          link: { href: "/app/inventaires", label: "Voir les inventaires" },
        }
      : { id: "etat_lieux", icon: "clipboardCheck", tone: "brand", title: "États des lieux", description: `Aucun inventaire en ${monthName.toLowerCase()}` },
    {
      id: "cautions",
      icon: "shield",
      tone: "solid",
      title: "Dépôts de garantie",
      description: `${formatAmount(cautions.reduce((sum, caution) => sum + remainingAmount(caution), 0))} FCFA sécurisés`,
      meta: `${cautions.length} caution${cautions.length > 1 ? "s" : ""} détenue${cautions.length > 1 ? "s" : ""}`,
    },
    {
      id: "otr",
      icon: "receipt",
      tone: "deep",
      title: "Précompte OTR Togo (5%)",
      description: `${formatAmount(Math.round(collected * 0.05))} FCFA retenus`,
      meta: month < AS_OF_MONTH ? "Déclaration transmise" : "Déclaration prête",
    },
    {
      id: "maintenance",
      icon: "wrench",
      tone: "brand",
      title: "Maintenance & Travaux",
      description: openRepairs[0] ? openRepairs[0].description : "Aucune intervention en cours",
      meta: openRepairs[0] ? openRepairs[0].property : undefined,
      badge: openRepairs.length > 0 ? `${openRepairs.length} intervention${openRepairs.length > 1 ? "s" : ""}` : undefined,
      link: repairs.length > 0 ? { href: "/app/maintenances", label: "Voir les maintenances" } : undefined,
    },
    {
      id: "comptabilite",
      icon: "wallet",
      tone: "solid",
      title: "Comptabilité immobilière",
      description: `Journal des recettes ${monthName}`,
      badge: month < AS_OF_MONTH ? "Clôturé" : "En cours",
      link: { href: "/app/comptabilites", label: "Consulter le bilan" },
    },
  ];

  const firstMonth = mockWorkspaceContracts.reduce((first, item) => (item.signedAt.slice(0, 7) < first ? item.signedAt.slice(0, 7) : first), month);
  const encaissements: DashboardData["encaissements"] = [];
  for (let current = firstMonth; current <= month; current = addMonths(current, 1)) {
    encaissements.push({ month: current, amount: agreements.reduce((sum, agreement) => sum + collectedOn(agreement, current), 0) });
  }

  const payoutDate = `${addMonths(month, 1)}-05`;
  const single = contract ? agreements[0] : undefined;

  return {
    greeting: {
      firstName: "Kossi",
      month,
      collectedRate: due === 0 ? 0 : Math.round((collected / due) * 100),
      tenantsToRemind: toRemind,
      synced: true,
    },
    kpis: [
      {
        id: "loyers_collectes",
        label: "Loyers collectés",
        value: collected,
        unit: "FCFA",
        icon: "cash",
        tone: "brand",
        footnote: {
          kind: "trend",
          deltaPercent: collectedBefore === 0 ? 0 : Math.round(((collected - collectedBefore) / collectedBefore) * 1000) / 10,
          comparedTo: MONTHS_LONG[parseMonth(previous).monthIndex],
        },
      },
      {
        id: "en_attente",
        label: "En attente / Retards",
        value: Math.max(0, due - collected),
        unit: "FCFA",
        icon: "clock",
        tone: "warning",
        footnote: { kind: "alert", text: toRemind > 0 ? `${toRemind} locataire${toRemind > 1 ? "s" : ""} à relancer` : "Aucun locataire à relancer" },
      },
      {
        id: "taux_occupation",
        label: "Taux d'occupation",
        value: units === 0 ? 0 : Math.round(((units - vacant) / units) * 1000) / 10,
        unit: "%",
        icon: "building",
        tone: "deep",
        footnote: { kind: "occupancy", occupied: units - vacant, total: units, vacant },
      },
      {
        id: "solde_net",
        label: "Solde net à reverser",
        value: net,
        unit: "FCFA",
        icon: "bank",
        tone: "solid",
        footnote: { kind: "success", text: `Virement le 5 ${MONTHS_LONG[parseMonth(addMonths(month, 1)).monthIndex]}` },
      },
    ],
    versement: {
      amount: net,
      bankName: single ? single.payout.bank : `${active.length} comptes propriétaires`,
      accountHolder: single ? single.owner.name : "Plusieurs propriétaires",
      estimatedDate: payoutDate,
      status: month < AS_OF_MONTH ? "valide" : "en_attente",
    },
    encaissements,
    recentEncaissements: recent.slice(0, 4),
    recentEncaissementsTotal: recent.length,
    reminders,
  };
}
