import type { ManagementAgreementItem } from "@/lib/api/management_agreements/management_agreements.types";
import type { PortofolioPropertyItem } from "@/lib/api/portofolios/portofolios.types";
import { managementAgreementLabel } from "./management_agreement_label";
import type {
  ManagementAgreement,
  ManagementAgreementsData,
  ManagementAvailableBien,
  ManagementRemuneration,
} from "../types";

/** Reference shown everywhere (header, tables, portfolio): the contract number, or its id. */
export function agreementReference(
  item: Pick<ManagementAgreementItem, "id" | "numero_contrat">,
) {
  return item.numero_contrat?.trim() || `CG-${item.id}`;
}

/** Properties still assigned to the contract (not withdrawn). */
export function assignedProperties(item: ManagementAgreementItem) {
  return item.proprietes.filter((assignment) => !assignment.date_retrait);
}

function remuneration(item: ManagementAgreementItem): ManagementRemuneration {
  const fixed =
    /fix|forfait/i.test(item.mode_renumeration) ||
    (item.taux_gestion == null && item.montant_fixe != null);
  return fixed
    ? { mode: "fixe", amount: item.montant_fixe ?? 0 }
    : { mode: "pourcentage", percent: item.taux_gestion ?? 0 };
}

const place = (quartier?: string | null, ville?: string | null) =>
  [quartier, ville].filter(Boolean).join(", ");

function building(item: ManagementAgreementItem) {
  const properties = assignedProperties(item);
  const first = properties[0]?.propriete;
  if (!first) return "Aucun bien affecté";
  const where = place(first.quartier?.denomination, first.ville?.denomination);
  const more = properties.length > 1 ? ` (+${properties.length - 1})` : "";
  return `${first.titre}${more}${where ? ` · ${where}` : ""}`;
}

/** A backend contract as the management agreements screen shows it. */
export function toManagementAgreement(
  item: ManagementAgreementItem,
  today: string,
): ManagementAgreement {
  const properties = assignedProperties(item);
  const ended = item.date_fin != null && item.date_fin < today;
  return {
    id: item.id,
    reference: agreementReference(item),
    label: managementAgreementLabel({
      building: item.observation,
      number: agreementReference(item),
      owner: item.proprietaire?.name ?? "—",
      manager: item.gestionnaire?.name ?? "—",
    }),
    manager: item.gestionnaire?.name ?? "—",
    // The backend does not say whether the owner is a company.
    owner: { name: item.proprietaire?.name ?? "—", kind: "particulier" },
    remuneration: remuneration(item),
    payout: {
      iban: item.compte_bancaire_iban ?? "",
      bank: item.compte_bancaire_iban
        ? "Compte bancaire du propriétaire"
        : "Non renseigné",
    },
    building: building(item),
    description: item.observation ?? "",
    signedAt: item.date_signature,
    startDate: item.date_debut,
    status: ended
      ? "resilie"
      : item.date_debut > today || properties.length === 0
        ? "en_attente"
        : "actif",
    biensCount: properties.length,
    monthlyRents: properties.reduce(
      (sum, assignment) => sum + (assignment.propriete.cout_mensuel ?? 0),
      0,
    ),
    assigned: [],
    termination:
      ended && item.date_fin
        ? { date: item.date_fin, reason: "fin_mandat" }
        : undefined,
  };
}

/** Active contracts at the end of each of the `months` previous months, oldest first. */
function activeHistory(
  agreements: ManagementAgreement[],
  today: string,
  months = 6,
) {
  const [year, month] = today.split("-").map(Number);
  return Array.from({ length: months }, (_, index) => {
    const end = new Date(Date.UTC(year, month - 1 - (months - index) + 1, 0))
      .toISOString()
      .slice(0, 10);
    return agreements.filter(
      (agreement) =>
        agreement.signedAt <= end &&
        (!agreement.termination || agreement.termination.date > end),
    ).length;
  });
}

/** Portfolio properties no contract covers yet, offered by "Affecter un bien immobilier". */
function availableBiens(
  items: ManagementAgreementItem[],
  portofolio: PortofolioPropertyItem[],
): ManagementAvailableBien[] {
  const covered = new Set(
    items.flatMap((item) =>
      assignedProperties(item).map((assignment) => assignment.propriete.id),
    ),
  );
  return portofolio
    .filter((entry) => !covered.has(entry.propriete.id))
    .map(({ propriete }) => ({
      id: propriete.id,
      label: propriete.titre,
      details: [
        propriete.piece
          ? `${propriete.piece} pièce${propriete.piece > 1 ? "s" : ""}`
          : null,
        propriete.surface ? `${propriete.surface} m²` : null,
        propriete.quartier?.denomination,
      ]
        .filter(Boolean)
        .join(" · "),
    }));
}

export function toManagementAgreementsData(
  items: ManagementAgreementItem[],
  portofolio: PortofolioPropertyItem[],
  today: string,
): ManagementAgreementsData {
  const agreements = items.map((item) => toManagementAgreement(item, today));
  return {
    asOf: today,
    agreements,
    availableBiens: availableBiens(items, portofolio),
    activeHistory: activeHistory(agreements, today),
  };
}
