import i18next from "i18next";
import { initReactI18next } from "react-i18next";

export const SUPPORTED_LANGUAGES = ["fr", "en"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

/** Language rendered on the server and used before the visitor's preference is known. */
export const DEFAULT_LANGUAGE: Language = "fr";

export const LANGUAGE_LABELS: Record<Language, string> = {
  fr: "Français",
  en: "English",
};

export const LANGUAGE_STORAGE_KEY = "lang";

/**
 * Shared i18next instance. It always starts in DEFAULT_LANGUAGE so server and first
 * client render match; the stored/browser language is applied after hydration
 * (see `applyPreferredLanguage` in ./language).
 *
 * Features register their own strings with `registerTranslations`.
 */
export const i18n = i18next.createInstance();

void i18n.use(initReactI18next).init({
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: [...SUPPORTED_LANGUAGES],
  defaultNS: "common",
  ns: ["common"],
  resources: {},
  interpolation: { escapeValue: false },
  returnObjects: true,
  initAsync: false,
  react: { bindI18nStore: "added" },
});

/**
 * Register (or replace) one namespace of translations for every supported language.
 * Always replaces: the i18n instance outlives module reloads in dev, so a skipped
 * registration would keep serving stale content.
 */
export function registerTranslations(
  namespace: string,
  bundles: Record<Language, Record<string, unknown>>,
) {
  for (const language of SUPPORTED_LANGUAGES) {
    i18n.removeResourceBundle(language, namespace);
    i18n.addResourceBundle(language, namespace, bundles[language], false, true);
  }
}

export function isLanguage(value: unknown): value is Language {
  return typeof value === "string" && (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

/** Normalizes codes like "en-US" or "fr_FR" to a supported language, if any. */
export function toLanguage(code: string | null | undefined): Language | undefined {
  const base = code?.toLowerCase().split(/[-_]/)[0];
  return isLanguage(base) ? base : undefined;
}
