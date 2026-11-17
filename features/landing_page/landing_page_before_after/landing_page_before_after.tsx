import { LandingIcon } from "../shared/landing_icon";
import { LandingSectionHeading } from "../shared/landing_section_heading";
import "../shared/landing_shared.css";
import "./landing_page_before_after.css";
import type { LandingPageBeforeAfterProps } from "./type";

export function LandingPageBeforeAfter({ id = "avant", heading, items }: LandingPageBeforeAfterProps) {
  return (
    <section id={id} className="lp-section">
      <div className="lp-wrap">
        <LandingSectionHeading {...heading} />
        <div className="lp-ba-list">
          {items.map((item) => (
            <div key={item.before} className="lp-ba-row" data-reveal="">
              <s>{item.before}</s>
              <i>
                <LandingIcon name="arrow" strokeWidth={2.4} />
              </i>
              <b>{item.after}</b>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
