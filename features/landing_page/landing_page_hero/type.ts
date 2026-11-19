import type { LandingAction, LandingIconName, LandingStatusItem } from "../shared/type";

export type LandingHeroPlatform = {
  icon: LandingIconName;
  label: string;
};

/** Content of the animated phone mock on the right of the hero. */
export type LandingHeroPhoneMock = {
  title: string;
  location: string;
  amount: string;
  currency: string;
  /** Rows appear one after another (max 3 are animated). */
  rows: LandingStatusItem[];
  /** Floating chips around the phone (max 2 are positioned). */
  chips: LandingStatusItem[];
};

export type LandingPageHeroProps = {
  id?: string;
  title: string;
  highlight: string;
  description: string;
  actions: LandingAction[];
  /** Optional tags under the buttons (e.g. "Mobile app", "Web platform"); hidden when empty. */
  platforms?: LandingHeroPlatform[];
  trustItems: string[];
  phone: LandingHeroPhoneMock;
};
