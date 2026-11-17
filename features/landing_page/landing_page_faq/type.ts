import type { LandingSectionHeading } from "../shared/type";

export type LandingFaqItem = {
  question: string;
  answer: string;
};

export type LandingPageFaqProps = {
  id?: string;
  heading: LandingSectionHeading;
  items: LandingFaqItem[];
};
