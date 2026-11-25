import type { RentCollection, RentCollectionLine, RentCollectionLineKind } from "../types";

/** Money actually received (with or without a receipt issued). */
export function isReceived(collection: RentCollection) {
  return collection.status === "encaisse" || collection.status === "recu_genere";
}

export function isPending(collection: RentCollection) {
  return collection.status === "en_attente" || collection.status === "en_retard";
}

export function collectionTotal(collection: RentCollection) {
  return collection.lines.reduce((sum, line) => sum + line.amount, 0);
}

export function hasLine(collection: RentCollection, kind: RentCollectionLineKind) {
  return collection.lines.some((line) => line.kind === kind);
}

export function linesTotal(collection: RentCollection, kind: RentCollectionLineKind) {
  return collection.lines.filter((line) => line.kind === kind).reduce((sum, line) => sum + line.amount, 0);
}

/** Agency commission on a line, FCFA. */
export function lineCommission(line: RentCollectionLine) {
  return Math.round((line.amount * (line.commissionPercent ?? 0)) / 100);
}

/** Part of a line paid out to the owner, FCFA. */
export function lineOwnerShare(line: RentCollectionLine) {
  return line.amount - lineCommission(line);
}

const chargeShort = { eau: "eau", electricite: "élec.", entretien: "entretien" } as const;

/**
 * What the payment covers, as in the table:
 * "Loyer novembre 2026", "Loyer + charges élec.", "Caution (3 mois) + loyer".
 */
export function natureLabel(collection: RentCollection) {
  const [first, ...rest] = collection.lines;
  if (!first) return "";
  if (rest.length === 0) return first.label;

  const charges = collection.lines.filter((line) => line.kind === "charges");
  const parts: string[] = [];
  for (const line of collection.lines) {
    if (line.kind === "charges") {
      if (line !== charges[0]) continue;
      const types = charges.map((charge) => (charge.chargeType ? chargeShort[charge.chargeType] : "")).filter(Boolean);
      parts.push(types.length ? `charges ${types.join(" & ")}` : "charges");
    } else if (line.kind === "loyer") {
      parts.push("loyer");
    } else {
      parts.push(line.label);
    }
  }
  const text = parts.join(" + ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}
