import type { LandingAction, LandingLink, LandingLogo } from "../shared/type";

export type LandingPageHeaderProps = {
  logo: LandingLogo;
  links: LandingLink[];
  cta: LandingAction;
  /** Accessible name of the <nav>. */
  navLabel?: string;
  /** Rendered before the CTA, e.g. language and theme switches. */
  controls?: React.ReactNode;
};
