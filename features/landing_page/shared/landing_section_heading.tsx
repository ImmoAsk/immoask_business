import "./landing_shared.css";
import type { LandingSectionHeading as LandingSectionHeadingProps } from "./type";

export function LandingSectionHeading({ title, subtitle }: LandingSectionHeadingProps) {
  return (
    <div className="lp-head" data-reveal="">
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  );
}
