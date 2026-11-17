import type { LandingSectionHeading } from "../shared/type";

export type LandingTestimonial = {
  quote: string;
  author: string;
  /** Location or role shown under the author's name. */
  meta: string;
  /** Avatar letter; defaults to the first letter of `author`. */
  initial?: string;
};

export type LandingPageTestifyProps = {
  id?: string;
  heading: LandingSectionHeading;
  testimonials: LandingTestimonial[];
};
