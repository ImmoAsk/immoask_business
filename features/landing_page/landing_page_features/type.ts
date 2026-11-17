import type { LandingIconName, LandingSectionHeading } from "../shared/type";

export type LandingFeatureTile = {
  icon: LandingIconName;
  /** Use "\n" to force a line break in the title. */
  title: string;
  description: string;
  /** Columns spanned on a 6-column grid (2 or 4 in the original design). */
  span?: 2 | 3 | 4 | 6;
  /** Gradient highlight tile. */
  highlighted?: boolean;
};

export type LandingPageFeaturesProps = {
  id?: string;
  heading: LandingSectionHeading;
  tiles: LandingFeatureTile[];
};
