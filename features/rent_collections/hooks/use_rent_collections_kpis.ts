import type { RentCollection, RentCollectionKpis } from "../types";
import { collectionTotal, isPending, isReceived, linesTotal } from "./rent_collections_money";

/** Derives the four cards from the payments, so they always match the table. */
export function computeRentCollectionsKpis(
  collections: RentCollection[],
  previousMonthRent: number | null,
  escrowActive: boolean,
): RentCollectionKpis {
  const received = collections.filter(isReceived);
  const pending = collections.filter(isPending);
  const rentReceived = received.reduce((sum, collection) => sum + linesTotal(collection, "loyer"), 0);
  const rentDue = rentReceived + pending.reduce((sum, collection) => sum + linesTotal(collection, "loyer"), 0);
  const chargeLines = received.flatMap((collection) => collection.lines.filter((line) => line.kind === "charges"));
  const deposits = received.filter((collection) => collection.lines.some((line) => line.kind === "caution"));
  const mobileMoneyCount = received.filter((collection) => collection.channel === "mobile_money").length;

  return {
    rent: {
      amount: rentReceived,
      deltaPercent: previousMonthRent ? ((rentReceived - previousMonthRent) / previousMonthRent) * 100 : null,
      recoveredPercent: rentDue === 0 ? 100 : (rentReceived / rentDue) * 100,
      count: received.length,
      mobileMoneyCount,
      otherCount: received.length - mobileMoneyCount,
    },
    charges: {
      amount: chargeLines.reduce((sum, line) => sum + line.amount, 0),
      water: chargeLines.filter((line) => line.chargeType === "eau").length,
      electricity: chargeLines.filter((line) => line.chargeType === "electricite").length,
    },
    deposits: {
      amount: deposits.reduce((sum, collection) => sum + linesTotal(collection, "caution"), 0),
      count: deposits.length,
      escrowActive,
    },
    pending: {
      amount: pending.reduce((sum, collection) => sum + collectionTotal(collection), 0),
      count: pending.length,
    },
  };
}

export function useRentCollectionsKpis(
  collections: RentCollection[],
  previousMonthRent: number | null,
  escrowActive: boolean,
) {
  return computeRentCollectionsKpis(collections, previousMonthRent, escrowActive);
}
