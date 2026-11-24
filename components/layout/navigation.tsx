"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";

export type NavItem = {
  href: string;
  label: string;
  icon: IconName;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

/** Sidebar entries, one per route folder in app/app. */
export const APP_NAVIGATION: NavSection[] = [
  {
    title: "Général",
    items: [
      { href: "/app/dashboard", label: "Tableau de bord", icon: "dashboard" },
      { href: "/app/encaissements", label: "Encaissements", icon: "cash" },
      { href: "/app/paiements", label: "Paiements", icon: "wallet" },
    ],
  },
  {
    title: "Patrimoine",
    items: [
      { href: "/app/portofolio", label: "Portofolio", icon: "building" },
      { href: "/app/proprietaires", label: "Propriétaires", icon: "key" },
      { href: "/app/contrats-gestion", label: "Contrats de gestion", icon: "clipboardCheck" },
      { href: "/app/locataires", label: "Locataires", icon: "users" },
      { href: "/app/contrats-location", label: "Contrats de location", icon: "file" },
      { href: "/app/inventaires", label: "Inventaires", icon: "clipboard" },
      { href: "/app/maintenances", label: "Maintenance", icon: "wrench" },
      { href: "/app/reservations", label: "Réservations", icon: "calendarCheck" },
      { href: "/app/calendriers", label: "Calendriers", icon: "calendar" },
    ],
  },
  {
    title: "Finances",
    items: [
      { href: "/app/versements", label: "Versements", icon: "bank" },
      { href: "/app/cautions", label: "Cautions", icon: "shield" },
      { href: "/app/fiscalites", label: "Fiscalité", icon: "receipt" },
      { href: "/app/comptabilites", label: "Comptabilité", icon: "book" },
    ],
  },
];

/** What a nav item shows on its right: a count, a short status, or a dot. */
export type NavBadge =
  | { kind: "count"; value: number }
  | { kind: "status"; label: string }
  | { kind: "dot" };

export function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export type NavigationProps = {
  sections?: NavSection[];
  /** Badges keyed by item href. */
  badges?: Partial<Record<string, NavBadge>>;
  /** Called after a link is followed (e.g. to close the mobile drawer). */
  onNavigate?: () => void;
};

export function Navigation({ sections = APP_NAVIGATION, badges = {}, onNavigate }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigation principale" className="flex flex-col gap-7">
      {sections.map((section) => (
        <div key={section.title}>
          <p className="mb-2 px-3 text-[11px] font-semibold tracking-[0.14em] text-zinc-400 uppercase dark:text-zinc-500">
            {section.title}
          </p>
          <ul className="flex flex-col gap-1">
            {section.items.map((item) => (
              <li key={item.href}>
                <NavLink
                  item={item}
                  active={isActivePath(pathname, item.href)}
                  badge={badges[item.href]}
                  onNavigate={onNavigate}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function NavLink({
  item,
  active,
  badge,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  badge?: NavBadge;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onNavigate={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] transition-colors",
        focusRing,
        active
          ? "bg-brand-50 font-semibold text-brand-700 dark:bg-brand-900/60 dark:text-brand-100"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-50",
      )}
    >
      <Icon
        name={item.icon}
        className={cn(
          "size-5 shrink-0",
          active ? "text-brand-600 dark:text-brand-100" : "text-zinc-400 dark:text-zinc-500",
        )}
      />
      <span className="flex-1 truncate">{item.label}</span>
      {badge ? <NavBadgeView badge={badge} /> : null}
    </Link>
  );
}

function NavBadgeView({ badge }: { badge: NavBadge }): ReactNode {
  switch (badge.kind) {
    case "count":
      return (
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600 tabular-nums dark:bg-white/10 dark:text-zinc-300">
          {badge.value}
        </span>
      );
    case "status":
      return (
        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap text-brand-700 dark:bg-brand-900/60 dark:text-brand-100">
          {badge.label}
        </span>
      );
    case "dot":
      return <span aria-hidden="true" className="size-2 rounded-full bg-brand-500" />;
  }
}
