"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { Header, type HeaderProps } from "./header";
import { Sidebar, type SidebarProps } from "./sidebar";

export type AppShellProps = {
  sidebar: Omit<SidebarProps, "onNavigate" | "className">;
  header?: Omit<HeaderProps, "onMenuClick" | "className">;
  children: ReactNode;
};

/**
 * Global back-office frame: fixed sidebar on desktop, drawer on mobile,
 * sticky header, scrollable content.
 */
export function AppShell({ sidebar, header, children }: AppShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50">
      {/* Desktop */}
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        <Sidebar {...sidebar} />
      </div>

      {/* Mobile drawer */}
      <div
        className={cn("fixed inset-0 z-50 lg:hidden", menuOpen ? "" : "pointer-events-none")}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div
          onClick={closeMenu}
          className={cn(
            "absolute inset-0 bg-zinc-950/40 transition-opacity",
            menuOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={cn(
            "absolute inset-y-0 left-0 transition-transform duration-200",
            menuOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <Sidebar {...sidebar} onNavigate={closeMenu} className="shadow-xl" />
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Fermer le menu"
            className={cn(
              "absolute top-4 right-3 grid size-9 place-items-center rounded-full text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/10",
              focusRing,
            )}
          >
            <Icon name="close" className="size-5" />
          </button>
        </div>
      </div>

      <div className="lg:pl-72">
        <Header {...header} onMenuClick={() => setMenuOpen(true)} />
        <main className="px-4 py-8 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
