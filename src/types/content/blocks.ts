import type { Faq, Feature, ImageAsset, Testimonial, TextRun } from "../common";
import type { BlockBase, PageContent } from "./page";

/**
 * Every section the CMS can place on a page, as data.
 *
 * One block type per section design, discriminated by `type`. Blocks are shared
 * across pages rather than namespaced per page — a "cta-banner" is the same
 * block wherever it appears, so its shape is defined once here and each page
 * composes its own union from these.
 *
 * Two rules hold for every block, because editors can reorder and hide them:
 *
 *   1. Copy is PLAIN STRINGS. No HTML, no markdown. Emphasis is structural:
 *      a paragraph that bolds phrases is a `TextRun[]`, never markup in a
 *      field.
 *   2. A block never depends on its neighbours. It owns its own background and
 *      its own vertical spacing, so any order renders correctly.
 */

/** A button or link. `href` may be a path, an in-page `#anchor`, or a URL. */
export type CtaContent = {
  label: string;
  href: string;
};

/** The opening section: typed eyebrow, paragraph, CTA and explainer video. */
export type HeroBlock = BlockBase & {
  type: "hero";
  /** Rendered by the typed-text widget. Not a heading, on the live site or here. */
  eyebrow: string;
  /** The paragraph. One bold phrase on the live site, but the shape allows any. */
  body: TextRun[];
  cta: CtaContent;
  video: {
    youtubeId: string;
    title: string;
    poster: ImageAsset | null;
  };
};

/**
 * A product screenshot beside a paragraph. No heading — the live section has
 * none, and the page's only `h1` belongs to the feature grid.
 */
export type OverviewBlock = BlockBase & {
  type: "overview";
  /** The paragraph. Three phrases are bold on the live site. */
  body: TextRun[];
  /** Null renders nothing rather than a broken image. */
  image: ImageAsset | null;
  /** Which side the image sits on from `md` up. */
  mediaSide?: "left" | "right";
};

/** The icon-box grid: two columns of features, inside a decorative bracket. */
export type FeatureGridBlock = BlockBase & {
  type: "feature-grid";
  anchorId?: string | null;
  eyebrow?: string | null;
  heading: string;
  description?: string | null;
  /**
   * Which heading element this block's title renders as. A page needs exactly
   * one `h1`, and because blocks are reorderable the CMS has to say which block
   * carries it rather than any section assuming it does.
   */
  headingLevel?: "h1" | "h2";
  features: Feature[];
  /** Repeated through the grid. Omit for a grid with no buttons. */
  cta?: CtaContent | null;
  /**
   * How many features to show between CTAs. The live grid is 12 features in
   * rows of two with a button after every fourth, so this is 4 — expressed as
   * a count rather than hard-coded so an editor can add a feature without the
   * buttons landing mid-row.
   */
  ctaAfterEvery?: number;
};

/** A bulleted list beside an image, under its own full-width heading band. */
export type BenefitMediaBlock = BlockBase & {
  type: "benefit-media";
  /** The live `h2` carries `id="student-benefits"`, so it is a real URL. */
  anchorId?: string | null;
  heading: string;
  items: string[];
  /** Null renders the placeholder panel — no broken image while art is pending. */
  image: ImageAsset | null;
  /** Which side the image sits on from `lg` up. */
  mediaSide?: "left" | "right";
};

/** The free-trial signup band: copy beside the form, on brand red. */
export type TrialCtaBlock = BlockBase & {
  type: "trial-cta";
  /** The live in-page anchor. External links point at it, so it is content. */
  anchorId: string;
  eyebrow?: string | null;
  heading: string;
  /**
   * The copy beside the form, as GROUPS of paragraphs — `[group][paragraph]`.
   *
   * The nesting is not decoration. The live section splits this copy across
   * three text widgets, and the spacing differs by level: 12px between groups,
   * 18px between paragraphs inside one, because Elementor zeroes the bottom
   * margin of a widget's last paragraph. Flattening the list would put one of
   * the two gaps 6px out.
   */
  body: TextRun[][][];
  privacyNote: string;
};

/**
 * Quotes from teachers, centred under their own heading.
 *
 * On the live page this and `faqs` are ONE Elementor section sharing a
 * `#FFF8F8` ground — this block is everything above that section's inner
 * section. Both blocks therefore declare the ground themselves; see PARITY
 * deviation 20 for why we cannot let one pay for the other.
 */
export type TestimonialsBlock = BlockBase & {
  type: "testimonials";
  /** The live `h2` carries `id="what-are-the-teachers-saying"`. */
  anchorId?: string | null;
  heading: string;
  items: Testimonial[];
  /** "Click here to see more testimonials". Omit for a block with no button. */
  cta?: CtaContent | null;
};

/**
 * The Q&A list beside an image, which also emits its own FAQPage JSON-LD.
 *
 * NOT an accordion: the live section is a plain list of `h2` questions and
 * paragraph answers, all open. It was built as a shadcn accordion before the
 * live markup was available.
 */
export type FaqsBlock = BlockBase & {
  type: "faqs";
  anchorId?: string | null;
  eyebrow?: string | null;
  heading: string;
  items: Faq[];
  /** Null renders nothing rather than a broken image. */
  image?: ImageAsset | null;
  /** Which side the image sits on from `md` up. */
  mediaSide?: "left" | "right";
  /** "Got more questions?" — the smaller heading above the closing button. */
  closingHeading?: string | null;
  cta?: CtaContent | null;
};

/** The repeated full-width "start your trial" band. */
export type CtaBannerBlock = BlockBase & {
  type: "cta-banner";
  heading: string;
  body: string;
  cta: CtaContent;
};

/**
 * The page's sign-off: a brand-red mission strip, then a red-on-white
 * statement. Two live sections (`92421d6` and `b7134d7`) that always appear
 * together immediately above the footer, so they are one block.
 *
 * There is NO button, unlike `cta-banner` — the live sections hold nothing but
 * text widgets.
 *
 * A third live section sits between them (`5a93287`, a "Footer Links:" list)
 * carrying `elementor-hidden-desktop elementor-hidden-tablet
 * elementor-hidden-phone`. It renders for nobody and is deliberately not
 * reproduced — see PARITY.
 */
export type ClosingStatementBlock = BlockBase & {
  type: "closing-statement";
  /** The red strip's paragraph. One paragraph, no emphasis, so a plain string. */
  intro: string;
  /**
   * The sign-off paragraphs. Runs rather than strings because the live first
   * paragraph forces its own line breaks — three deliberate lines, not wrapped
   * text — which `breakAfter` carries as data instead of markup.
   */
  statement: TextRun[][];
};

/** The blocks the home page can render. */
export type HomeBlock =
  | HeroBlock
  | OverviewBlock
  | FeatureGridBlock
  | BenefitMediaBlock
  | TrialCtaBlock
  | TestimonialsBlock
  | FaqsBlock
  | CtaBannerBlock
  | ClosingStatementBlock;

export type HomePageContent = PageContent<HomeBlock>;
