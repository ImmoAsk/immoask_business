"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { LandingButton } from "../shared/landing_button";
import { LandingIcon } from "../shared/landing_icon";
import { LandingSectionHeading } from "../shared/landing_section_heading";
import "../shared/landing_shared.css";
import "./landing_page_pricing.css";
import type { LandingPagePricingProps, LandingPricingPlan } from "./type";

function PricingCard({ plan }: { plan: LandingPricingPlan }) {
  return (
    <div className={cn("lp-pricing-card", plan.featured && "lp-pricing-featured")} data-reveal="">
      {plan.tag ? <span className="lp-pricing-tag">{plan.tag}</span> : null}
      <h3>{plan.name}</h3>
      <div className="lp-pricing-price">
        {plan.price}{" "}
        <small className={plan.priceUnitOnNewLine ? "lp-pricing-unitBlock" : undefined}>
          {plan.priceUnit}
        </small>
      </div>
      <div className="lp-pricing-sub">{plan.description}</div>
      <ul>
        {plan.features.map((feature) => (
          <li key={feature}>
            <LandingIcon name="check" strokeWidth={2.6} />
            {feature}
          </li>
        ))}
      </ul>
      <LandingButton
        variant={plan.featured ? "white" : "ghost"}
        {...plan.cta}
        className="lp-pricing-cardBtn"
      />
    </div>
  );
}

export function LandingPagePricing({ id = "formules", heading, audiences }: LandingPagePricingProps) {
  const [activeId, setActiveId] = useState(audiences[0]?.id);

  return (
    <section id={id} className="lp-section lp-sectionFlushTop">
      <div className="lp-wrap">
        <LandingSectionHeading {...heading} />
        {audiences.length > 1 ? (
          <div className="lp-pricing-tabs" role="tablist">
            {audiences.map((audience) => (
              <button
                key={audience.id}
                type="button"
                role="tab"
                id={`${id}-tab-${audience.id}`}
                aria-controls={`${id}-panel-${audience.id}`}
                aria-selected={audience.id === activeId}
                onClick={() => setActiveId(audience.id)}
              >
                {audience.label}
              </button>
            ))}
          </div>
        ) : null}
        {audiences.map((audience) => (
          <div
            key={audience.id}
            id={`${id}-panel-${audience.id}`}
            role="tabpanel"
            aria-labelledby={`${id}-tab-${audience.id}`}
            className={cn("lp-pricing-grid", audience.plans.length === 2 && "lp-pricing-gridTwo")}
            hidden={audience.id !== activeId}
          >
            {audience.plans.map((plan) => (
              <PricingCard key={`${plan.name}-${plan.price}`} plan={plan} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
