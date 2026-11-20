"use client";

import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { useTheme } from "@/lib/utils/theme";

export type ThemeToggleProps = {
  className?: string;
};

/** Sun ⇄ moon button: shows the moon in light mode and the sun in dark mode. */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const label = isDark ? "Activer le mode clair" : "Activer le mode sombre";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={cn(
        "grid size-11 place-items-center rounded-full text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/10",
        focusRing,
        className,
      )}
      // theme is unknown during SSR; hide the icon until it is resolved on the client
      style={theme ? undefined : { visibility: "hidden" }}
    >
      <Icon name={isDark ? "sun" : "moon"} className="size-5" />
    </button>
  );
}
