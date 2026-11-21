import { Pagination } from "@/components/ui/pagination";
import type { PaginationProps } from "@/components/ui/pagination";
import { PROPRIETAIRE_PAGE_SIZES } from "../hooks/use_proprietaires_list";

export type ProprietairesPaginationProps = Omit<PaginationProps, "itemLabel" | "pageSizes">;

export function ProprietairesPagination(props: ProprietairesPaginationProps) {
  return <Pagination {...props} itemLabel={["propriétaire", "propriétaires"]} pageSizes={PROPRIETAIRE_PAGE_SIZES} />;
}
