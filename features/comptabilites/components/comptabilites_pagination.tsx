import { Pagination } from "@/components/ui/pagination";
import type { PaginationProps } from "@/components/ui/pagination";
import { COMPTABILITE_PAGE_SIZES } from "../hooks/use_comptabilites_list";

export type ComptabilitesPaginationProps = Omit<PaginationProps, "itemLabel" | "pageSizes">;

export function ComptabilitesPagination(props: ComptabilitesPaginationProps) {
  return <Pagination {...props} itemLabel={["opération", "opérations"]} pageSizes={COMPTABILITE_PAGE_SIZES} />;
}
