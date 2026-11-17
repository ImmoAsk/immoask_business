import type { LandingIconName, LandingSectionHeading } from "../shared/type";

export type LandingPlatformFeature = {
  icon: LandingIconName;
  title: string;
  description: string;
};

export type LandingPlatformKpi = {
  value: string;
  label: string;
};

/** Laptop + phone device mock shown next to the feature list. */
export type LandingPlatformsMock = {
  webLabel: string;
  mobileLabel: string;
  kpis: LandingPlatformKpi[];
  /** Bar heights in percent (0–100). */
  chartBars: number[];
  amount: string;
  currency: string;
  mobileRows: string[];
};

export type LandingPagePlatformsProps = {
  id?: string;
  heading: LandingSectionHeading;
  mock: LandingPlatformsMock;
  features: LandingPlatformFeature[];
};
