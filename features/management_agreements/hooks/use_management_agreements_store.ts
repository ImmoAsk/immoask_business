"use client";

import { useState } from "react";
import type { ManagementAgreement, ManagementAvailableBien, ManagementTerminationReason } from "../types";

/**
 * Contracts and unassigned properties, changed by "Affecter un bien" and "Résilier".
 * `available` follows the loaded list (it may arrive after the contracts), minus the properties assigned here.
 * Kept in memory for now: wire both actions to the API once the mutations exist.
 */
export function useManagementAgreementsStore(initial: ManagementAgreement[], loadedAvailable: ManagementAvailableBien[]) {
  const [agreements, setAgreements] = useState(initial);
  const [assignedIds, setAssignedIds] = useState<ReadonlySet<string>>(() => new Set());

  return {
    agreements,
    available: loadedAvailable.filter((bien) => !assignedIds.has(bien.id)),
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
      setAssignedIds((previous) => new Set(previous).add(bien.id));
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
