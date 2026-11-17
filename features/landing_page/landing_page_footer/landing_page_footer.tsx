import Image from "next/image";
import "../shared/landing_shared.css";
import "./landing_page_footer.css";
import type { LandingPageFooterProps } from "./type";

export function LandingPageFooter({ logo, links, copyright }: LandingPageFooterProps) {
  return (
    <footer className="lp-footer-footer">
      <div className="lp-wrap lp-footer-inner">
        <a className="lp-footer-logo" href={logo.href} aria-label={logo.alt}>
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            sizes="230px"
          />
        </a>
        <div className="lp-footer-links">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              // external pages (terms, privacy, legal notice) open in a new tab
              {...(/^https?:\/\//.test(link.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {link.label}
            </a>
          ))}
        </div>
        <span>{copyright}</span>
      </div>
    </footer>
  );
}
