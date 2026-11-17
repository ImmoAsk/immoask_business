"use client";

import { useTranslation } from "react-i18next";
import { DEFAULT_LANGUAGE, useLanguage } from "@/lib/utils";
import { LandingPage } from "./landing_page";
import { LANDING_NAMESPACE, landingPageContents } from "./landing_page_i18n";
import { LandingLanguageSwitch } from "./shared/landing_language_switch";
import { LandingThemeSwitch } from "./shared/landing_theme_switch";
import type { LandingPageContent } from "./type";

/**
 * Landing page bound to the shared i18n instance: renders the content of the current
 * language and adds the language (FR/EN) and theme (sun/moon) switches to the header.
 */
export function LandingPageLocalized() {
  // `detect` applies the visitor's saved/browser language once, after hydration.
  const { language } = useLanguage({ detect: true });
  const { i18n } = useTranslation(LANDING_NAMESPACE);
  const content =
    (i18n.getResourceBundle(language, LANDING_NAMESPACE) as LandingPageContent | undefined) ??
    landingPageContents[DEFAULT_LANGUAGE];

  return (
    <LandingPage
      content={content}
      language={language}
      headerControls={
        <>
          <LandingLanguageSwitch
            label={content.ui.switchLanguage}
            code={content.ui.switchLanguageCode}
          />
          <LandingThemeSwitch
            toDarkLabel={content.ui.switchToDark}
            toLightLabel={content.ui.switchToLight}
          />
        </>
      }
    />
  );
}
