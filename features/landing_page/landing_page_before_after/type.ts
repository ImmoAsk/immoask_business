import type { LandingSectionHeading } from "../shared/type";

export type LandingBeforeAfterItem = {
  before: string;
  after: string;
};

export type LandingPageBeforeAfterProps = {
  id?: string;
  heading: LandingSectionHeading;
  items: LandingBeforeAfterItem[];
};
