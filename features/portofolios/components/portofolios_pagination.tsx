import { Pagination } from "@/components/ui/pagination";
import type { PaginationProps } from "@/components/ui/pagination";
import { PORTOFOLIO_PAGE_SIZES } from "../hooks/use_portofolio_list";

export type PortofoliosPaginationProps = Omit<PaginationProps, "itemLabel" | "pageSizes">;

export function PortofoliosPagination(props: PortofoliosPaginationProps) {
  return <Pagination {...props} itemLabel={["bien", "biens"]} pageSizes={PORTOFOLIO_PAGE_SIZES} />;
}
