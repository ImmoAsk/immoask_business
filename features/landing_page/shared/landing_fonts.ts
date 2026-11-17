import { Bricolage_Grotesque, Figtree } from "next/font/google";

export const landingDisplayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-landing-display",
  display: "swap",
});

export const landingTextFont = Figtree({
  subsets: ["latin"],
  variable: "--font-landing-text",
  display: "swap",
});
