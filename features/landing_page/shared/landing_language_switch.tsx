"use client";

import { LANGUAGE_LABELS, toggleLanguage, useLanguage } from "@/lib/utils";
import "./landing_shared.css";

export type LandingLanguageSwitchProps = {
  /** Accessible label, e.g. "Switch to French". */
  label: string;
  /** Short code displayed on the button (the language it switches to). */
  code: string;
};

/** FR ⇄ EN toggle button. */
export function LandingLanguageSwitch({ label, code }: LandingLanguageSwitchProps) {
  const { language } = useLanguage();

  return (
    <button
      type="button"
      className="lp-switch"
      aria-label={label}
      title={`${LANGUAGE_LABELS[language]} → ${label}`}
      onClick={() => void toggleLanguage()}
    >
      {code}
    </button>
  );
}
