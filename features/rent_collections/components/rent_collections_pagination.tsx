import { Pagination } from "@/components/ui/pagination";
import type { PaginationProps } from "@/components/ui/pagination";
import { RENT_COLLECTION_PAGE_SIZES } from "../hooks/use_rent_collections_list";

export type RentCollectionsPaginationProps = Omit<PaginationProps, "itemLabel" | "pageSizes">;

export function RentCollectionsPagination(props: RentCollectionsPaginationProps) {
  return <Pagination {...props} itemLabel={["encaissement", "encaissements"]} pageSizes={RENT_COLLECTION_PAGE_SIZES} />;
}
