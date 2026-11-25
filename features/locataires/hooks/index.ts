export { daysBetween, isLeaseEndingSoon, LEASE_END_WINDOW_DAYS } from "./locataires_dates";
export { useLocatairesData } from "./use_locataires_data";
export type { UseLocatairesDataResult } from "./use_locataires_data";
export { computeLocatairesKpis, useLocatairesKpis } from "./use_locataires_kpis";
export {
  areaKey,
  areaOptions,
  countActiveFilters,
  DEFAULT_LOCATAIRE_FILTERS,
  LOCATAIRE_PAGE_SIZES,
  matchesQuickFilter,
  useLocatairesList,
} from "./use_locataires_list";
export type { UseLocatairesListResult } from "./use_locataires_list";
export { useLocatairesSelection } from "./use_locataires_selection";
export type { UseLocatairesSelectionResult } from "./use_locataires_selection";
export { useLocatairesInScope } from "./use_locataires_scope";
