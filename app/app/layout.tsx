import { AppShell } from "@/components/layout";
import { mockNavBadges, mockPeriodLabel, mockScopeOptions, mockUser } from "@/mocks/app_shell";

export default function AppLayout({ children }: LayoutProps<"/app">) {
  return (
    <AppShell
      sidebar={{ user: mockUser, badges: mockNavBadges }}
      header={{
        scopeOptions: mockScopeOptions,
        scope: "gestion",
        periodLabel: mockPeriodLabel,
        hasUnreadNotifications: true,
      }}
    >
      {children}
    </AppShell>
  );
}
