"use client";

import { useState } from "react";
import type { ManagementAgreement, ManagementAvailableBien, ManagementTerminationReason } from "../types";

/**
 * Contracts and unassigned properties, changed by "Affecter un bien" and "Résilier".
 * Kept in memory for now: wire both actions to lib/api/contrats-gestion once the API exists.
 */
export function useManagementAgreementsStore(initial: ManagementAgreement[], initialAvailable: ManagementAvailableBien[]) {
  const [agreements, setAgreements] = useState(initial);
  const [available, setAvailable] = useState(initialAvailable);

  return {
    agreements,
    available,
    /** A property joins the contract and leaves the unassigned list. */
    assign: (agreementId: string, bien: ManagementAvailableBien) => {
      setAgreements((previous) =>
        previous.map((agreement) =>
          agreement.id === agreementId
            ? {
                ...agreement,
                biensCount: agreement.biensCount + 1,
                assigned: [...agreement.assigned, { id: bien.id, label: bien.label.split(" · ")[0] }],
              }
            : agreement,
        ),
      );
      setAvailable((previous) => previous.filter((item) => item.id !== bien.id));
    },
    terminate: (agreementId: string, reason: ManagementTerminationReason, date: string) =>
      setAgreements((previous) =>
        previous.map((agreement) =>
          agreement.id === agreementId ? { ...agreement, status: "resilie", termination: { date, reason } } : agreement,
        ),
      ),
  };
}

export type UseManagementAgreementsStoreResult = ReturnType<typeof useManagementAgreementsStore>;
