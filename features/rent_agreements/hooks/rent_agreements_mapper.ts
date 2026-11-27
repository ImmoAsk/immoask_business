import { managementAgreementLabel } from "@/features/management_agreements/hooks/management_agreement_label";
import { agreementReference } from "@/features/management_agreements/hooks/management_agreements_mapper";
import {
  CONTRAT_STATUT_VALUES,
  type RentAgreementItem,
} from "@/lib/api/rent_agreements/rent_agreements.types";
import type {
  RentAgreement,
  RentAgreementsData,
  RentAgreementType,
  RentDeposit,
} from "../types";

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

/** Lease kind from the property's usage (the backend's `type_contrat` 1 / 2 does not tell residential from commercial). */
function typeOf({ propriete }: RentAgreementItem): RentAgreementType {
  if (propriete.usage === "Sejour") return "sejour";
  if (propriete.usage === "Commercial") return "commercial";
  return "habitation";
}

/** `caution_avance` holds either a number of months ("6") or an amount in FCFA ("100000"). */
function depositOf({ propriete }: RentAgreementItem): RentDeposit {
  const value = Number(propriete.caution_avance);
  if (!Number.isFinite(value) || value <= 0) return { mode: "mois", months: 0 };
  return value <= 36
    ? { mode: "mois", months: value }
    : { mode: "montant", amount: value };
}

/** "Appartement · Tokoin, Lomé", or the property title without a category. */
function propertyLabel({ propriete }: RentAgreementItem) {
  const category = propriete.categorie_propriete?.denomination?.trim();
  const place = [
    propriete.quartier?.denomination,
    propriete.ville?.denomination,
  ]
    .filter(Boolean)
    .join(", ");
  const name = category
    ? `${capitalize(category)} N°${propriete.nuo}`
    : propriete.titre;
  return place ? `${name} · ${place}` : name;
}

const dayBefore = (iso: string) => {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
};

function managementOf({
  contrat_gestion: contract,
  proprietaire,
}: RentAgreementItem): RentAgreement["management"] {
  const owner = contract?.proprietaire?.name ?? proprietaire?.name ?? "—";
  if (!contract)
    return { reference: "", owner, label: "Sans contrat de gestion" };
  const reference = agreementReference(contract);
  return {
    reference,
    owner,
    label: managementAgreementLabel({
      building: contract.observation,
      number: reference,
      owner,
      manager: contract.gestionnaire?.name ?? "—",
    }),
  };
}

/** A backend lease as the rent agreements screen shows it. */
export function toRentAgreement(
  item: RentAgreementItem,
  today: string,
): RentAgreement {
  const finished = item.statut === CONTRAT_STATUT_VALUES.Termine;
  // A finished lease ends on its end date, or (without one) is shown as ended yesterday.
  const endDate = item.date_fin ?? (finished ? dayBefore(today) : undefined);
  return {
    id: item.id,
    reference: `CL-${item.id.padStart(4, "0")}`,
    management: managementOf(item),
    property: propertyLabel(item),
    type: typeOf(item),
    tenant: item.locataire?.name ?? "—",
    amount: item.montant_final,
    startDate: item.date_debut.slice(0, 10),
    endDate:
      endDate && finished && endDate >= today
        ? dayBefore(today)
        : endDate?.slice(0, 10),
    deposit: depositOf(item),
  };
}

/** Active leases at the end of each of the `months` previous months, oldest first. */
function activeHistory(agreements: RentAgreement[], today: string, months = 6) {
  const [year, month] = today.split("-").map(Number);
  return Array.from({ length: months }, (_, index) => {
    const end = new Date(Date.UTC(year, month - 1 - (months - index) + 1, 0))
      .toISOString()
      .slice(0, 10);
    return agreements.filter(
      (agreement) =>
        agreement.startDate <= end &&
        (!agreement.endDate || agreement.endDate > end),
    ).length;
  });
}

export function toRentAgreementsData(
  items: RentAgreementItem[],
  today: string,
): RentAgreementsData {
  const agreements = items.map((item) => toRentAgreement(item, today));
  return {
    asOf: today,
    agreements,
    activeHistory: activeHistory(agreements, today),
  };
}
