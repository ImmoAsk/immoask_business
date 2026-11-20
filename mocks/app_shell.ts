import type { HeaderOption, NavBadge, SidebarUser } from "@/components/layout";

// Placeholder data for the back-office frame until auth and the API are wired.

export const mockUser: SidebarUser = {
  name: "Kossi Adanou",
  role: "Propriétaire",
};

export const mockNavBadges: Partial<Record<string, NavBadge>> = {
  "/app/portofolio": { kind: "count", value: 28 },
  "/app/maintenances": { kind: "status", label: "1 en cours" },
};

export const mockScopeOptions: HeaderOption[] = [
  { value: "gestion", label: "Contrats de gestion" },
  { value: "baux", label: "Baux" },
  { value: "tous", label: "Tous les contrats" },
];

export const mockPeriodLabel = "Janvier 2025";
