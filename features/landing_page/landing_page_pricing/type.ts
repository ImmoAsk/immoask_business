import type { LandingAction, LandingSectionHeading } from "../shared/type";

export type LandingPricingPlan = {
  name: string;
  price: string;
  priceUnit: string;
  /** Render the unit on its own line under the price (long units). */
  priceUnitOnNewLine?: boolean;
  description: string;
  features: string[];
  cta: LandingAction;
  /** Blue highlighted card, slightly scaled up. */
  featured?: boolean;
  /** Small badge on top of the card, e.g. "Meilleur tarif". */
  tag?: string;
};

export type LandingPricingAudience = {
  id: string;
  label: string;
  plans: LandingPricingPlan[];
};

export type LandingPagePricingProps = {
  id?: string;
  heading: LandingSectionHeading;
  /** One tab per audience; the first one is selected by default. */
  audiences: LandingPricingAudience[];
};
