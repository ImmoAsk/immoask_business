import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { themeInitScript } from "@/lib/utils/theme_script";
import "./globals.css";

// Keep in sync with DEFAULT_LANGUAGE in lib/utils/i18n (not imported: that module loads react-i18next).
const DEFAULT_LANGUAGE = "fr";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ImmoAsk Business",
  description: "Gestion locative pour les propriétaires, la diaspora et les professionnels de l'immobilier.",
  applicationName: "ImmoAsk Business",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={DEFAULT_LANGUAGE}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      // lang and data-theme are set on the client (theme script, language switch)
      suppressHydrationWarning
    >
      <head>
        {/* Applies the saved/OS theme before first paint (no light/dark flash). */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
