/**
 * The icons a CMS editor can pick from, by name.
 *
 * A name, not a component: JSON cannot carry a `LucideIcon`, so the icon a
 * feature card shows has to survive a round trip through the CMS as a string.
 * `src/lib/icons` resolves a name to its component, and that registry is the
 * only place lucide-react is imported for content icons.
 */
export type IconName =
  // The twelve the live home page uses, named as Font Awesome names them.
  | "bezier-curve"
  | "calendar-alt"
  | "certificate"
  | "chart-bar"
  | "chart-line"
  | "comments"
  | "edit"
  | "envelope"
  | "file-invoice"
  | "file-powerpoint"
  | "handshake"
  | "school"
  // Placeholder icons on pages not yet rebuilt against the live site.
  | "award"
  | "book-open"
  | "calendar-range"
  | "credit-card"
  | "graduation-cap"
  | "mail"
  | "message-square"
  | "rocket"
  | "settings"
  | "sparkles"
  | "trending-up"
  | "wallet";

export type NavLink = {
  label: string;
  href: string;
  /** External links open in a new tab and get rel="noopener". */
  external?: boolean;
};

export type SocialLink = {
  label: string;
  href: string;
  icon: "twitter" | "facebook" | "instagram" | "youtube";
};

export type Feature = {
  title: string;
  description: TextRun[];
  /** The live cards carry a bullet list under the description. */
  bullets?: TextRun[][];
  icon?: IconName | null;
};

/**
 * The live `Q:` and `A:` prefixes are part of the copy, not decoration added by
 * the section — the markup has them inside the heading and the paragraph. They
 * stay in the strings so an editor sees exactly what renders.
 */
export type Faq = {
  question: string;
  answer: string;
};

export type Testimonial = {
  /**
   * Runs, not a string: the live quote bolds four phrases and forces its own
   * line breaks, and both have to survive the CMS as data rather than markup.
   */
  quote: TextRun[];
  author: string;
  location?: string;
  role?: string;
};

/**
 * A run of copy, optionally emphasised.
 *
 * Keeps block copy plain text — no HTML, no markdown — while letting a
 * paragraph bold any number of phrases. The hero bolds one, the overview
 * paragraph bolds three, so a `{ before, emphasis, after }` triple does not
 * generalise; a run list does, and collapses to a single entry when nothing is
 * emphasised. Rendered by `RichText`.
 */
export type TextRun = {
  text: string;
  bold?: boolean;
  /**
   * Forces a line break after this run. The live feature copy uses a single
   * `<br>`; this keeps that expressible without letting HTML into a field.
   */
  breakAfter?: boolean;
};

export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Breadcrumb = {
  label: string;
  href?: string;
};
