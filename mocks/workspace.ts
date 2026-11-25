import type { WorkspaceContract } from "@/features/workspace/types";
import { mockManagementAgreements } from "./management_agreements";

// Placeholder for GET /management-agreements/options until the API is wired.

/** Property names each mock contract covers, so the other screens' mock records can be matched. */
const propertiesByContract: Record<string, string[]> = {
  "CG-2026-0001": ["Résidence Les Palmiers"],
  "CG-2026-0002": ["Villa duplex · Agoè-Nyivé"],
  "CG-2026-0003": ["Centre commercial Kara"],
  "CG-2026-0004": ["Adidogomé"],
  "CG-2026-0005": ["Bè-Kpota"],
  "CG-2026-0006": ["Baguida"],
  "CG-2026-0007": ["Boulevard du 13 Janvier"],
  "CG-2026-0008": ["Zone portuaire"],
};

export const mockWorkspaceContracts: WorkspaceContract[] = mockManagementAgreements.agreements.map((agreement) => ({
  id: agreement.id,
  reference: agreement.reference,
  owner: agreement.owner.name,
  building: agreement.building,
  status: agreement.status,
  signedAt: agreement.signedAt,
  properties: propertiesByContract[agreement.reference] ?? [agreement.building],
}));
