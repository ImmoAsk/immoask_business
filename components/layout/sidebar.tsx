"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { Navigation, type NavBadge, type NavSection } from "./navigation";

export type SidebarUser = {
  name: string;
  role: string;
  avatarUrl?: string;
};

export type SidebarProps = {
  user: SidebarUser;
  sections?: NavSection[];
  badges?: Partial<Record<string, NavBadge>>;
  onNavigate?: () => void;
  /** Shows "Se déconnecter" in the account menu. */
  onLogout?: () => void;
  className?: string;
};

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function Sidebar({
  user,
  sections,
  badges,
  onNavigate,
  onLogout,
  className,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full w-72 flex-col border-r border-zinc-200/70 bg-white dark:border-white/10 dark:bg-zinc-950",
        className,
      )}
    >
      <Link
        href="/app/dashboard"
        onNavigate={onNavigate}
        aria-label="ImmoAsk Business — Tableau de bord"
        className={cn("mx-4 mt-5 mb-7 flex items-start rounded-xl px-2 py-1", focusRing)}
      >
        <Image
          src="/images/immoask_business_logo.png"
          alt=""
          width={1613}
          height={770}
          sizes="176px"
          preload
          className="h-auto w-44"
        />
      </Link>

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <Navigation sections={sections} badges={badges} onNavigate={onNavigate} />
      </div>

      <div className="flex items-center gap-3 border-t border-zinc-200/70 px-6 py-5 dark:border-white/10">
        <Avatar size="lg" className="bg-brand-50 font-semibold text-brand-700 dark:bg-brand-900 dark:text-brand-100">
          <AvatarImage src={user.avatarUrl} alt="" />
          <AvatarFallback>{initials(user.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate font-semibold text-zinc-950 dark:text-zinc-50">{user.name}</p>
          <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">{user.role}</p>
        </div>
        <UserMenu onLogout={onLogout} />
      </div>
    </aside>
  );
}

// `cn` does not merge conflicting classes, so colors are kept out of the shared base.
const menuItem = cn("flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm", focusRing);

/** "⋮" account menu, opening upwards. Closes on Escape, on pick, or when focus leaves it. */
function UserMenu({ onLogout }: { onLogout?: () => void }) {
  const [open, setOpen] = useState(false);
  const menuId = "sidebar-user-menu";

  return (
    <div
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      <button
        type="button"
        aria-label="Menu du compte"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "grid size-8 cursor-pointer place-items-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-white/10",
          focusRing,
        )}
      >
        <Icon name="moreVertical" className="size-5" />
      </button>
      {open ? (
        <ul
          id={menuId}
          role="menu"
          className="absolute right-0 bottom-full z-20 mb-2 w-56 rounded-2xl border border-zinc-100 bg-white p-1.5 shadow-lg dark:border-white/10 dark:bg-zinc-900"
        >
          {onLogout ? (
            <li role="none">
              <button
                type="button"
                role="menuitem"
                className={cn(menuItem, "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10")}
                onClick={() => {
                  setOpen(false);
                  onLogout();
                }}
              >
                <Icon name="logOut" className="size-4" /> Se déconnecter
              </button>
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
