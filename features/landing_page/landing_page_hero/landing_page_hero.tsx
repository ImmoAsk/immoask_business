import { cn } from "@/lib/cn";
import { LandingButton } from "../shared/landing_button";
import { LandingIcon } from "../shared/landing_icon";
import "../shared/landing_shared.css";
import "./landing_page_hero.css";
import type { LandingPageHeroProps } from "./type";

const rowAnimation = ["lp-hero-r1", "lp-hero-r2", "lp-hero-r3"];
const chipPosition = ["lp-hero-c1", "lp-hero-c2"];

export function LandingPageHero({
  id = "top",
  title,
  highlight,
  description,
  actions,
  platforms,
  trustItems,
  phone,
}: LandingPageHeroProps) {
  return (
    <header className="lp-hero-hero" id={id}>
      <div className="lp-wrap lp-hero-grid">
        <div>
          <h1 className="lp-hero-title">
            {title}
            <span>{highlight}</span>
          </h1>
          <p className="lp-hero-description">{description}</p>
          <div className="lp-ctaRow">
            {actions.map((action) => (
              <LandingButton key={action.label} {...action} />
            ))}
          </div>
          <div className="lp-hero-platforms">
            {platforms.map((platform) => (
              <span key={platform.label}>
                <LandingIcon name={platform.icon} strokeWidth={2} />
                {platform.label}
              </span>
            ))}
          </div>
          <div className="lp-hero-trust">
            {trustItems.map((item) => (
              <span key={item}>
                <LandingIcon name="check" strokeWidth={2.6} />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="lp-hero-stage" aria-hidden="true">
          <div className="lp-hero-blob" />
          <div className="lp-hero-phone">
            <div className="lp-hero-phoneHead">
              <span>{phone.title}</span>
              <span>{phone.location}</span>
            </div>
            <div className="lp-hero-amount">
              {phone.amount} <small>{phone.currency}</small>
            </div>
            <div className="lp-bar">
              <i />
            </div>
            {phone.rows.map((row, index) => (
              <div key={row.label} className={cn("lp-hero-row", rowAnimation[index])}>
                <span className="lp-hero-dot">
                  <LandingIcon name="check" strokeWidth={2.6} />
                </span>
                <div>
                  {row.label}
                  {row.caption ? <small>{row.caption}</small> : null}
                </div>
              </div>
            ))}
          </div>
          {phone.chips.map((chip, index) => (
            <div key={chip.label} className={cn("lp-hero-chip", chipPosition[index])}>
              <span className="lp-hero-chipDot">
                <LandingIcon name="check" strokeWidth={2.6} />
              </span>
              <div>
                {chip.label}
                {chip.caption ? <small>{chip.caption}</small> : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
