import { Pagination } from "@/components/ui/pagination";
import type { PaginationProps } from "@/components/ui/pagination";
import { RENT_PAYMENT_PAGE_SIZES } from "../hooks/use_rent_payments_list";

export type RentPaymentsPaginationProps = Omit<PaginationProps, "itemLabel" | "pageSizes">;

export function RentPaymentsPagination(props: RentPaymentsPaginationProps) {
  return <Pagination {...props} itemLabel={["paiement de loyer", "paiements de loyer"]} pageSizes={RENT_PAYMENT_PAGE_SIZES} />;
}
