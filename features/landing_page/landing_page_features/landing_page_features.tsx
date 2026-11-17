import { Fragment } from "react";
import { cn } from "@/lib/cn";
import { LandingIcon } from "../shared/landing_icon";
import { LandingSectionHeading } from "../shared/landing_section_heading";
import "../shared/landing_shared.css";
import "./landing_page_features.css";
import type { LandingPageFeaturesProps } from "./type";

const spanClass = {
  2: "lp-features-span2",
  3: "lp-features-span3",
  4: "lp-features-span4",
  6: "lp-features-span6",
} as const;

export function LandingPageFeatures({ id = "valeur", heading, tiles }: LandingPageFeaturesProps) {
  return (
    <section id={id} className="lp-section lp-sectionFlushTop">
      <div className="lp-wrap">
        <LandingSectionHeading {...heading} />
        <div className="lp-features-bento">
          {tiles.map((tile) => (
            <div
              key={tile.title}
              className={cn(
                "lp-features-tile",
                spanClass[tile.span ?? 2],
                tile.highlighted && "lp-features-highlighted",
              )}
              data-reveal=""
            >
              <div className="lp-features-icon">
                <LandingIcon name={tile.icon} strokeWidth={2} />
              </div>
              <div>
                <h3>
                  {tile.title.split("\n").map((line, index) => (
                    <Fragment key={index}>
                      {index > 0 ? <br /> : null}
                      {line}
                    </Fragment>
                  ))}
                </h3>
                <p>{tile.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
