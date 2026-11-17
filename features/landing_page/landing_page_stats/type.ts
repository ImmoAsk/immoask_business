export type LandingStatItem = {
  /** Target number reached by the count-up animation. */
  value: number;
  suffix?: string;
  label: string;
};

export type LandingPageStatsProps = {
  id?: string;
  items: LandingStatItem[];
  /** Count-up duration in milliseconds. */
  durationMs?: number;
};
