import type { LandingLink, LandingLogo } from "../shared/type";

export type LandingPageFooterProps = {
  logo: LandingLogo;
  links: LandingLink[];
  copyright: string;
};
