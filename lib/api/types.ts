// Every backend type in one import: `import type { Propriete, User } from "@/lib/api/types";`
// Each domain's types also stay importable from its own folder (e.g. "@/lib/api/properties/properties.types").
export type * from "./shared/shared.types";
export type * from "./accounts/accounts.types";
export type * from "./calendrier_disponibilites/calendrier_disponibilites.types";
export type * from "./comptabilites/comptabilites.types";
export type * from "./dashboard/dashboard.types";
export type * from "./landlords/landlords.types";
export type * from "./maintenances/maintenances.types";
export type * from "./portofolios/portofolios.types";
export type * from "./management_agreements/management_agreements.types";
export type * from "./properties/properties.types";
export type * from "./rent_agreements/rent_agreements.types";
export type * from "./rent_collections/rent_collections.types";
export type * from "./rent_payments/rent_payments.types";
export type * from "./reservations/reservations.types";
export type * from "./tenants/tenants.types";
export type * from "./versements/versements.types";

// Enum value maps (runtime constants).
export { IMAGE_PHOTO_VIDEO_VALUES, PROPRIETE_GARAGE_VALUES, PROPRIETE_MENAGE_VALUES, PROPRIETE_USAGE_VALUES } from "./properties/properties.types";
export { STATUT_PROPRIETE_VALUES, SUPER_ADMIN_ROLE_ID } from "./portofolios/portofolios.types";
