import "./landing_page_marquee.css";
import type { LandingPageMarqueeProps } from "./type";

export function LandingPageMarquee({ items }: LandingPageMarqueeProps) {
  const loop = [...items, ...items];

  return (
    <div className="lp-marquee-marquee" aria-hidden="true">
      <div className="lp-marquee-track">
        {loop.map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </div>
  );
}
