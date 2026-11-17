// No React / client imports here: this file is used by the root layout (a Server Component).

export const THEMES = ["light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

export const THEME_STORAGE_KEY = "theme";
export const THEME_ATTRIBUTE = "data-theme";

/**
 * Inline script for <head>: applies the saved theme (or the OS preference) to <html>
 * before the first paint, so there is no light/dark flash on load.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("${THEME_ATTRIBUTE}",t);document.documentElement.style.colorScheme=t}catch(e){}})()`;
