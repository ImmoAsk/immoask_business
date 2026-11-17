import { LandingSectionHeading } from "../shared/landing_section_heading";
import "../shared/landing_shared.css";
import "./landing_page_testify.css";
import type { LandingPageTestifyProps } from "./type";

export function LandingPageTestify({ id = "avis", heading, testimonials }: LandingPageTestifyProps) {
  return (
    <section id={id} className="lp-section lp-sectionFlushTop">
      <div className="lp-wrap">
        <LandingSectionHeading {...heading} />
        <div className="lp-testify-grid">
          {testimonials.map((testimonial) => (
            <figure key={testimonial.author} data-reveal="">
              <blockquote>« {testimonial.quote} »</blockquote>
              <figcaption>
                <i aria-hidden="true">{testimonial.initial ?? testimonial.author.charAt(0)}</i>
                <div>
                  {testimonial.author}
                  <small>{testimonial.meta}</small>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
