import type { CSSProperties } from "react";
import { LandingIcon } from "../shared/landing_icon";
import { LandingSectionHeading } from "../shared/landing_section_heading";
import "../shared/landing_shared.css";
import "./landing_page_platforms.css";
import type { LandingPagePlatformsProps } from "./type";

const SIDEBAR_ITEMS = 4;

export function LandingPagePlatforms({
  id = "plateformes",
  heading,
  mock,
  features,
}: LandingPagePlatformsProps) {
  return (
    <section id={id} className="lp-section lp-platforms-section">
      <div className="lp-wrap">
        <LandingSectionHeading {...heading} />
        <div className="lp-platforms-grid">
          <div className="lp-platforms-mock" aria-hidden="true" data-reveal="">
            <span className="lp-platforms-label lp-platforms-webLabel">{mock.webLabel}</span>
            <div className="lp-platforms-laptop">
              <div className="lp-platforms-sidebar">
                {Array.from({ length: SIDEBAR_ITEMS }, (_, index) => (
                  <i key={index} className={index === 0 ? "lp-platforms-sidebarActive" : undefined} />
                ))}
              </div>
              <div className="lp-platforms-main">
                <div className="lp-platforms-kpis">
                  {mock.kpis.map((kpi) => (
                    <div key={kpi.label}>
                      {kpi.value}
                      <small>{kpi.label}</small>
                    </div>
                  ))}
                </div>
                <div className="lp-platforms-chart">
                  {mock.chartBars.map((height, index) => (
                    <i key={index} style={{ "--h": `${height}%` } as CSSProperties} />
                  ))}
                </div>
              </div>
            </div>
            <div className="lp-platforms-phone">
              <span className="lp-platforms-label lp-platforms-mobileLabel">{mock.mobileLabel}</span>
              <b>
                {mock.amount} <small>{mock.currency}</small>
              </b>
              <div className="lp-bar lp-platforms-phoneBar">
                <i />
              </div>
              {mock.mobileRows.map((row) => (
                <div key={row} className="lp-platforms-phoneRow">
                  <u />
                  {row}
                </div>
              ))}
            </div>
          </div>

          <div className="lp-platforms-list">
            {features.map((feature) => (
              <div key={feature.title} className="lp-platforms-item" data-reveal="">
                <span className="lp-platforms-icon">
                  <LandingIcon name={feature.icon} strokeWidth={2} />
                </span>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
