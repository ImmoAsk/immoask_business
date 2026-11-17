import { LandingButton } from "../shared/landing_button";
import "../shared/landing_shared.css";
import "./landing_page_cta.css";
import type { LandingPageCtaProps } from "./type";

export function LandingPageCta({ id = "demarrer", title, description, actions }: LandingPageCtaProps) {
  return (
    <section id={id} className="lp-section lp-sectionFlushTop">
      <div className="lp-wrap">
        <div className="lp-cta-final" data-reveal="">
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
          <div className="lp-ctaRow lp-cta-actions">
            {actions.map((action) => (
              <LandingButton key={action.label} {...action} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
