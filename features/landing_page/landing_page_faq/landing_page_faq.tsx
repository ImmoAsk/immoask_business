import { LandingIcon } from "../shared/landing_icon";
import { LandingSectionHeading } from "../shared/landing_section_heading";
import "../shared/landing_shared.css";
import "./landing_page_faq.css";
import type { LandingPageFaqProps } from "./type";

export function LandingPageFaq({ id = "faq", heading, items }: LandingPageFaqProps) {
  return (
    <section id={id} className="lp-section lp-sectionFlushTop">
      <div className="lp-wrap">
        <LandingSectionHeading {...heading} />
        <div className="lp-faq-faq" data-reveal="">
          {items.map((item) => (
            <details key={item.question}>
              <summary>
                {item.question}
                <i aria-hidden="true">
                  <LandingIcon name="plus" strokeWidth={2.6} />
                </i>
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
