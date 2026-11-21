import type { IconName } from "@/components/ui/icon";

export type DashboardReminderTone = "brand" | "deep" | "solid";

export type DashboardActionReminderData = {
  id: string;
  icon: IconName;
  tone: DashboardReminderTone;
  title: string;
  description: string;
  /** Short colored line under the description (date, status…). */
  meta?: string;
  /** Pill on the right, e.g. "1 intervention", "Prêt". */
  badge?: string;
  link?: { href: string; label: string };
};
