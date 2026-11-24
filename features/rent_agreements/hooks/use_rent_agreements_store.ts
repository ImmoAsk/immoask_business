"use client";

import { useState } from "react";
import type { RentAgreement, RentTerminationReason } from "../types";

/**
 * Leases, changed by "Résilier le contrat".
 * Kept in memory for now: wire `terminate` to lib/api/contrats-location once the API exists.
 */
export function useRentAgreementsStore(initial: RentAgreement[]) {
  const [agreements, setAgreements] = useState(initial);
  return {
    agreements,
    terminate: (agreementId: string, reason: RentTerminationReason, date: string) =>
      setAgreements((previous) =>
        previous.map((agreement) => (agreement.id === agreementId ? { ...agreement, termination: { date, reason } } : agreement)),
      ),
  };
}

export type UseRentAgreementsStoreResult = ReturnType<typeof useRentAgreementsStore>;
