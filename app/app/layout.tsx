import { WorkspaceShell } from "@/features/workspace";
import { mockNavBadges } from "@/mocks/app_shell";

export default function AppLayout({ children }: LayoutProps<"/app">) {
  return (
    <WorkspaceShell sidebar={{ badges: mockNavBadges }} header={{ hasUnreadNotifications: true }}>
      {children}
    </WorkspaceShell>
  );
}
