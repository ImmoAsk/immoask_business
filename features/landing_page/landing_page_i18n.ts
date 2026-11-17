import { registerTranslations, type Language } from "@/lib/utils/i18n";
import { landingPageContent as landingPageContentFr } from "./landing_page_content";
import { landingPageContentEn } from "./landing_page_content.en";
import type { LandingPageContent } from "./type";

export const LANDING_NAMESPACE = "landing";

export const landingPageContents: Record<Language, LandingPageContent> = {
  fr: landingPageContentFr,
  en: landingPageContentEn,
};

registerTranslations(LANDING_NAMESPACE, landingPageContents);
