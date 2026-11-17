"use client";

import LanguageDetector from "i18next-browser-languagedetector";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  DEFAULT_LANGUAGE,
  i18n,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  toLanguage,
  type Language,
} from "./i18n";

let detector: LanguageDetector | undefined;

function getDetector() {
  detector ??= new LanguageDetector(undefined, {
    order: ["localStorage", "navigator", "htmlTag"],
    lookupLocalStorage: LANGUAGE_STORAGE_KEY,
    caches: ["localStorage"],
  });
  return detector;
}

/** Current language of the shared i18n instance. */
export function getLanguage(): Language {
  return toLanguage(i18n.resolvedLanguage ?? i18n.language) ?? DEFAULT_LANGUAGE;
}

/** Switches the whole app to `language`, persists it and updates `<html lang>`. */
export async function switchLanguage(language: Language) {
  if (typeof document !== "undefined") {
    document.documentElement.lang = language;
    getDetector().cacheUserLanguage(language);
  }
  if (getLanguage() !== language) {
    await i18n.changeLanguage(language);
  }
  return language;
}

/** Flips between French and English (or cycles through SUPPORTED_LANGUAGES). */
export function toggleLanguage() {
  const index = SUPPORTED_LANGUAGES.indexOf(getLanguage());
  return switchLanguage(SUPPORTED_LANGUAGES[(index + 1) % SUPPORTED_LANGUAGES.length]);
}

/** Reads the saved choice (or the browser language) and applies it. Call once after hydration. */
export function applyPreferredLanguage() {
  const detected = getDetector().detect();
  const candidates = Array.isArray(detected) ? detected : [detected];
  const preferred = candidates.map(toLanguage).find(Boolean) ?? DEFAULT_LANGUAGE;
  return switchLanguage(preferred);
}

/**
 * React binding: re-renders on language change.
 * Pass `{ detect: true }` in one top-level component to apply the visitor's preference on mount.
 */
export function useLanguage({ detect = false }: { detect?: boolean } = {}) {
  const { i18n: instance } = useTranslation();
  const language = toLanguage(instance.resolvedLanguage ?? instance.language) ?? DEFAULT_LANGUAGE;

  useEffect(() => {
    if (detect) void applyPreferredLanguage();
  }, [detect]);

  return { language, switchLanguage, toggleLanguage };
}
