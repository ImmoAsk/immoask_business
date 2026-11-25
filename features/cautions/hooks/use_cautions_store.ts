"use client";

import { useState } from "react";
import type { Caution } from "../types";
import { usedAmount } from "./cautions_balance";

/**
 * Deposits and their movements.
 * Kept in memory for now: wire `reconstitute` to lib/api/cautions once the API exists.
 */
export function useCautionsStore(initial: Caution[]) {
  const [cautions, setCautions] = useState(initial);
  return {
    cautions,
    /** Records the tenant refilling what was taken, which makes the deposit whole again. */
    reconstitute: (cautionId: string, date: string) =>
      setCautions((previous) =>
        previous.map((caution) => {
          const used = caution.id === cautionId ? usedAmount(caution) : 0;
          if (used <= 0) return caution;
          return {
            ...caution,
            movements: [
              ...caution.movements,
              { id: `${caution.id}_r${caution.movements.length}`, kind: "reconstitution", date, label: "Reconstitution par le locataire", amount: used },
            ],
          };
        }),
      ),
  };
}

export type UseCautionsStoreResult = ReturnType<typeof useCautionsStore>;
