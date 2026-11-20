"use client";

import type { ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "./theme_toggle";

export type HeaderOption = { value: string; label: string };

export type HeaderProps = {
  /** Opens the mobile navigation drawer; the button only shows below `lg`. */
  onMenuClick?: () => void;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  /** Scope filter shown as a pill (e.g. management contracts vs. leases). */
  scopeOptions?: HeaderOption[];
  scope?: string;
  onScopeChange?: (value: string) => void;
  /** Current period label, e.g. "Janvier 2025". */
  periodLabel?: string;
  onPeriodClick?: () => void;
  hasUnreadNotifications?: boolean;
  onNotificationsClick?: () => void;
  /** Extra controls placed before the theme toggle and notification bell. */
  actions?: ReactNode;
  /** Light/dark switch next to the notification bell (on by default). */
  showThemeToggle?: boolean;
  className?: string;
};

// No `display` here: each use sets its own (`hidden md:inline-flex`, …).
const pill =
  "h-11 items-center gap-2.5 rounded-full bg-zinc-100/80 px-4 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10";

export function Header({
  onMenuClick,
  searchPlaceholder = "Rechercher un locataire, lot, reçu…",
  onSearch,
  scopeOptions,
  scope,
  onScopeChange,
  periodLabel,
  onPeriodClick,
  hasUnreadNotifications = false,
  onNotificationsClick,
  actions,
  showThemeToggle = true,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-20 items-center gap-3 border-b border-zinc-200/70 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-10 dark:border-white/10 dark:bg-zinc-950/90",
        className,
      )}
    >
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Ouvrir le menu"
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-full text-zinc-600 hover:bg-zinc-100 lg:hidden dark:text-zinc-300 dark:hover:bg-white/10",
          focusRing,
        )}
      >
        <Icon name="menu" className="size-5" />
      </button>

      <form
        role="search"
        className="relative min-w-0 flex-1 md:max-w-md"
        onSubmit={(event) => {
          event.preventDefault();
          const query = new FormData(event.currentTarget).get("q");
          onSearch?.(typeof query === "string" ? query.trim() : "");
        }}
      >
        <Icon
          name="search"
          className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-zinc-400"
        />
        <input
          type="search"
          name="q"
          placeholder={searchPlaceholder}
          aria-label="Rechercher"
          className={cn(
            "h-11 w-full rounded-full bg-zinc-100/80 pr-4 pl-11 text-sm text-zinc-900 placeholder:text-zinc-500 dark:bg-white/5 dark:text-zinc-50",
            focusRing,
          )}
        />
      </form>

      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
        {scopeOptions && scopeOptions.length > 0 ? (
          <label className={cn(pill, "relative hidden focus-within:ring-2 focus-within:ring-brand-500 md:inline-flex")}>
            <Icon name="file" className="size-5 text-zinc-500" />
            <span className="sr-only">Périmètre</span>
            <select
              defaultValue={scope}
              onChange={(event) => onScopeChange?.(event.target.value)}
              className="cursor-pointer appearance-none bg-transparent pr-6 outline-none"
            >
              {scopeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Icon
              name="chevronDown"
              className="pointer-events-none absolute right-4 size-4 text-zinc-500"
            />
          </label>
        ) : null}

        {periodLabel ? (
          <button
            type="button"
            onClick={onPeriodClick}
            className={cn(pill, "hidden sm:inline-flex", focusRing)}
            aria-label={`Période : ${periodLabel}`}
          >
            <Icon name="calendar" className="size-5 text-zinc-500" />
            {periodLabel}
          </button>
        ) : null}

        {actions}

        {showThemeToggle ? <ThemeToggle /> : null}

        <button
          type="button"
          onClick={onNotificationsClick}
          aria-label={hasUnreadNotifications ? "Notifications (non lues)" : "Notifications"}
          className={cn(
            "relative grid size-11 place-items-center rounded-full text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/10",
            focusRing,
          )}
        >
          <Icon name="bell" className="size-5" />
          {hasUnreadNotifications ? (
            <span className="absolute top-2.5 right-2.5 size-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-950" />
          ) : null}
        </button>
      </div>
    </header>
  );
}
