"use client";

import { useTheme } from "@/lib/utils";
import { LandingIcon } from "./landing_icon";
import "./landing_shared.css";

export type LandingThemeSwitchProps = {
  /** Label when the page is light (the button turns dark mode on). */
  toDarkLabel: string;
  /** Label when the page is dark (the button turns light mode on). */
  toLightLabel: string;
};

/** Sun ⇄ moon toggle button. Shows the moon in light mode and the sun in dark mode. */
export function LandingThemeSwitch({ toDarkLabel, toLightLabel }: LandingThemeSwitchProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const label = isDark ? toLightLabel : toDarkLabel;

  return (
    <button
      type="button"
      className="lp-switch"
      aria-label={label}
      title={label}
      onClick={toggleTheme}
      // theme is unknown during SSR; hide the icon until it is resolved on the client
      style={theme ? undefined : { visibility: "hidden" }}
    >
      <LandingIcon name={isDark ? "sun" : "moon"} strokeWidth={2} />
    </button>
  );
}
