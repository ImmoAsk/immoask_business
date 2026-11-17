import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { LandingIcon } from "./landing_icon";
import "./landing_shared.css";
import type { LandingAction } from "./type";

const variantClass = {
  primary: "lp-btnPrimary",
  ghost: "lp-btnGhost",
  white: "lp-btnWhite",
  glass: "lp-btnGlass",
} as const;

export type LandingButtonProps = LandingAction & {
  className?: string;
  style?: CSSProperties;
};

export function LandingButton({
  label,
  href,
  variant = "primary",
  withArrow = false,
  className,
  style,
}: LandingButtonProps) {
  return (
    <a
      className={cn("lp-btn", variantClass[variant], className)}
      href={href}
      style={style}
      // external links (e.g. the Calendly booking page) open in a new tab
      {...(/^https?:\/\//.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {label}
      {withArrow ? <LandingIcon name="arrow" strokeWidth={2.4} /> : null}
    </a>
  );
}
