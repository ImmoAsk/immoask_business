import type { LandingPageBeforeAfterProps } from "./landing_page_before_after/type";
import type { LandingPageCtaProps } from "./landing_page_cta/type";
import type { LandingPageFaqProps } from "./landing_page_faq/type";
import type { LandingPageFeaturesProps } from "./landing_page_features/type";
import type { LandingPageFooterProps } from "./landing_page_footer/type";
import type { LandingPageHeaderProps } from "./landing_page_header/type";
import type { LandingPageHeroProps } from "./landing_page_hero/type";
import type { LandingPageMarqueeProps } from "./landing_page_marquee/type";
import type { LandingPagePlatformsProps } from "./landing_page_platforms/type";
import type { LandingPagePricingProps } from "./landing_page_pricing/type";
import type { LandingPageStatsProps } from "./landing_page_stats/type";
import type { LandingPageTestifyProps } from "./landing_page_testify/type";

/** Labels of the page chrome (navigation, language and theme switches). */
export type LandingPageUi = {
  navLabel: string;
  /** Accessible label of the language button, e.g. "Switch to French". */
  switchLanguage: string;
  /** Short code shown on the language button (the language it switches to), e.g. "EN". */
  switchLanguageCode: string;
  switchToDark: string;
  switchToLight: string;
};

/** Full content of the landing page, one entry per section (in render order). */
export type LandingPageContent = {
  ui: LandingPageUi;
  header: Omit<LandingPageHeaderProps, "controls" | "navLabel">;
  hero: LandingPageHeroProps;
  marquee: LandingPageMarqueeProps;
  platforms: LandingPagePlatformsProps;
  beforeAfter: LandingPageBeforeAfterProps;
  features: LandingPageFeaturesProps;
  stats: LandingPageStatsProps;
  pricing: LandingPagePricingProps;
  testify: LandingPageTestifyProps;
  faq: LandingPageFaqProps;
  cta: LandingPageCtaProps;
  footer: LandingPageFooterProps;
};

export type LandingPageProps = {
  content: LandingPageContent;
  language?: string;
  /** Extra header controls (language / theme switches). */
  headerControls?: React.ReactNode;
};
