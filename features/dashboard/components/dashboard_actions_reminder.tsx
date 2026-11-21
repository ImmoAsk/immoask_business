import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import type { DashboardActionReminderData } from "../types";
import { dashboardPanel, toneText, toneTile } from "./dashboard_styles";

export type DashboardActionsReminderProps = {
  reminders: DashboardActionReminderData[];
  title?: string;
  className?: string;
};

export function DashboardActionsReminder({
  reminders,
  title = "Rappels & Actions",
  className,
}: DashboardActionsReminderProps) {
  return (
    <section aria-labelledby="dashboard-reminders-title" className={cn(dashboardPanel, "p-6 sm:p-7", className)}>
      <h2 id="dashboard-reminders-title" className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
        {title}
      </h2>
      <ul className="mt-5 flex flex-col gap-3">
        {reminders.map((reminder) => (
          <li key={reminder.id}>
            <ReminderItem reminder={reminder} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ReminderItem({ reminder }: { reminder: DashboardActionReminderData }) {
  return (
    <article className="flex gap-4 rounded-2xl border border-zinc-100 bg-zinc-50/60 p-4 dark:border-white/5 dark:bg-white/5">
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", toneTile[reminder.tone])}>
        <Icon name={reminder.icon} className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] leading-snug font-semibold text-zinc-950 dark:text-zinc-50">{reminder.title}</h3>
          {reminder.badge ? (
            <span
              className={cn(
                "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100",
              )}
            >
              {reminder.badge}
            </span>
          ) : null}
        </div>
        <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">{reminder.description}</p>
        {reminder.meta ? (
          <p className={cn("mt-2 text-[13px] font-medium", toneText[reminder.tone])}>{reminder.meta}</p>
        ) : null}
        {reminder.link ? (
          <Link
            href={reminder.link.href}
            className={cn(
              "mt-2 inline-flex items-center gap-1 rounded text-[13px] font-semibold text-brand-700 hover:underline dark:text-brand-100",
              focusRing,
            )}
          >
            {reminder.link.label}
            <Icon name="arrowRight" className="size-3.5" />
          </Link>
        ) : null}
      </div>
    </article>
  );
}
