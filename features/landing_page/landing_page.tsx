import { cn } from "@/lib/cn";
import { LandingPageBeforeAfter } from "./landing_page_before_after";
import { LandingPageCta } from "./landing_page_cta";
import { LandingPageFaq } from "./landing_page_faq";
import { LandingPageFeatures } from "./landing_page_features";
import { LandingPageFooter } from "./landing_page_footer";
import { LandingPageHeader } from "./landing_page_header";
import { LandingPageHero } from "./landing_page_hero";
import { LandingPageMarquee } from "./landing_page_marquee";
import { LandingPagePlatforms } from "./landing_page_platforms";
import { LandingPagePricing } from "./landing_page_pricing";
import { LandingPageStats } from "./landing_page_stats";
import { LandingPageTestify } from "./landing_page_testify";
import { landingDisplayFont, landingTextFont } from "./shared/landing_fonts";
import { LandingRevealObserver } from "./shared/landing_reveal_observer";
import "./shared/landing_shared.css";
import type { LandingPageProps } from "./type";

/** Presentational landing page: renders the given content. See LandingPageLocalized for i18n. */
export function LandingPage({ content, language = "fr", headerControls }: LandingPageProps) {
  return (
    <div
      className={cn("lp-root", landingDisplayFont.variable, landingTextFont.variable)}
      lang={language}
    >
      <LandingPageHeader {...content.header} navLabel={content.ui.navLabel} controls={headerControls} />
      <main>
        <LandingPageHero {...content.hero} />
        <LandingPageMarquee {...content.marquee} />
        <LandingPagePlatforms {...content.platforms} />
        <LandingPageBeforeAfter {...content.beforeAfter} />
        <LandingPageFeatures {...content.features} />
        <LandingPageStats {...content.stats} />
        <LandingPagePricing {...content.pricing} />
        <LandingPageTestify {...content.testify} />
        <LandingPageFaq {...content.faq} />
        <LandingPageCta {...content.cta} />
      </main>
      <LandingPageFooter {...content.footer} />
      <LandingRevealObserver />
    </div>
  );
}
