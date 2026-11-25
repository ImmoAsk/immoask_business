import type { WorkspaceContract } from "@/features/workspace/types";
import { mockWorkspaceContracts } from "@/mocks/workspace";

/** Base URL of the ImmoAsk API; without it the services answer with mock data. */
const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Management contracts the signed-in account can pick in the header,
 * with the properties each one covers.
 */
export async function fetchManagementAgreementOptions(signal?: AbortSignal): Promise<WorkspaceContract[]> {
  if (!API_URL) return mockWorkspaceContracts;
  const response = await fetch(`${API_URL}/management-agreements/options`, { signal, credentials: "include" });
  if (!response.ok) throw new Error(`Contrats de gestion indisponibles (${response.status})`);
  return (await response.json()) as WorkspaceContract[];
}
