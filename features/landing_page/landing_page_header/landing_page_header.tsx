"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { LandingButton } from "../shared/landing_button";
import "../shared/landing_shared.css";
import "./landing_page_header.css";
import type { LandingPageHeaderProps } from "./type";

export function LandingPageHeader({
  logo,
  links,
  cta,
  navLabel = "Navigation",
  controls,
}: LandingPageHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={cn("lp-header-nav", scrolled && "lp-header-scrolled")} aria-label={navLabel}>
      <div className="lp-wrap lp-header-inner">
        <a className="lp-header-logo" href={logo.href} aria-label={logo.alt}>
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            sizes="(max-width: 520px) 126px, 201px"
            preload
          />
        </a>
        <div className="lp-header-links">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
        <div className="lp-header-actions">
          {controls}
          <LandingButton {...cta} className="lp-header-cta" />
        </div>
      </div>
    </nav>
  );
}
