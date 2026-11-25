import { WorkspaceShell } from "@/features/workspace";
import { mockNavBadges, mockUser } from "@/mocks/app_shell";

export default function AppLayout({ children }: LayoutProps<"/app">) {
  return (
    <WorkspaceShell sidebar={{ user: mockUser, badges: mockNavBadges }} header={{ hasUnreadNotifications: true }}>
      {children}
    </WorkspaceShell>
  );
}
