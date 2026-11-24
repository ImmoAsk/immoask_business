import type { Metadata } from "next";
import { ManagementAgreements } from "@/features/management_agreements";

export const metadata: Metadata = {
  title: "Contrats de gestion — ImmoAsk Business",
};

export default function ContratsGestionPage() {
  return <ManagementAgreements />;
}
