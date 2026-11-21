import { Pagination } from "@/components/ui/pagination";
import type { PaginationProps } from "@/components/ui/pagination";
import { LOCATAIRE_PAGE_SIZES } from "../hooks/use_locataires_list";

export type LocatairesPaginationProps = Omit<PaginationProps, "itemLabel" | "pageSizes">;

export function LocatairesPagination(props: LocatairesPaginationProps) {
  return <Pagination {...props} itemLabel={["locataire", "locataires"]} pageSizes={LOCATAIRE_PAGE_SIZES} />;
}
