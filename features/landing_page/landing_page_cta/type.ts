import type { LandingAction } from "../shared/type";

export type LandingPageCtaProps = {
  id?: string;
  title: string;
  description?: string;
  actions: LandingAction[];
};
