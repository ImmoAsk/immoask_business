export type LandingIconName =
  | "check"
  | "arrow"
  | "plus"
  | "phone"
  | "monitor"
  | "bank"
  | "wrench"
  | "shield"
  | "sun"
  | "moon";

export type LandingButtonVariant = "primary" | "ghost" | "white" | "glass";

export type LandingLink = {
  label: string;
  href: string;
};

export type LandingAction = LandingLink & {
  variant?: LandingButtonVariant;
  /** Show the trailing arrow icon. */
  withArrow?: boolean;
};

export type LandingLogo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  href: string;
};

export type LandingSectionHeading = {
  title: string;
  subtitle?: string;
};

/** A labelled item with an optional small caption, used by mock UI rows and chips. */
export type LandingStatusItem = {
  label: string;
  caption?: string;
};
