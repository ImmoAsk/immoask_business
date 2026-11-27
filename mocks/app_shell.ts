import type { NavBadge } from "@/components/layout";

// Placeholder data for the back-office frame until auth and the API are wired.

export const mockNavBadges: Partial<Record<string, NavBadge>> = {
  "/app/portofolio": { kind: "count", value: 28 },
  "/app/maintenances": { kind: "status", label: "1 en cours" },
};
