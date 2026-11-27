/**
 * How a management contract is named everywhere (header, tables, details, exports):
 * "Immeuble Ave Maria : Contrat de gestion No. CG-2026-LFB6ZS entre EKEWOU GERARD et ImmoAsk by Omnisoft Africa SARLU".
 * `building` is the backend `observation` ("Immeuble …"); without it the label starts at "Contrat de gestion".
 */
export function managementAgreementLabel({
  building,
  number,
  owner,
  manager,
}: {
  building?: string | null;
  number: string;
  owner: string;
  manager: string;
}) {
  // Only the first line of the observation names the building ("Immeubles Vogan:\n…").
  const name = (building ?? "").split("\n")[0].trim().replace(/\s*:$/, "");
  const contract = `Contrat de gestion No. ${number} entre ${owner} et ${manager}`;
  return name ? `${name} : ${contract}` : contract;
}
