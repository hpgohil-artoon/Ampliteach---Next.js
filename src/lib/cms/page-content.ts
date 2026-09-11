import { z } from "zod";
import type { HomePageContent } from "@/types";
import { ICON_NAMES } from "@/lib/icons";

/**
 * The CMS wire format for page content, as runtime schemas.
 *
 * These mirror the types in `src/types/content/` one-for-one, and the return
 * type on each parser is what proves it: if a schema drifts from its type, the
 * build fails here rather than rendering `undefined` into the page.
 *
 * Nothing else in the app trusts a CMS payload. A page that fails validation is
 * rejected whole and the caller falls back to the committed content, so a bad
 * publish can never ship a half-rendered page. `docs/CMS-CONTRACT.md` is the
 * human-readable version of this file — keep the two in step.
 */

const imageAssetSchema = z.object({
  src: z.string().min(1),
  alt: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const ctaSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

/**
 * A paragraph as runs of plain text, some emphasised. Never HTML.
 *
 * `breakAfter` has to be here even though it is optional: zod strips unknown
 * keys, so a CMS payload's line breaks would be silently dropped and the
 * testimonial quote would render as one long line.
 */
const textRunsSchema = z.array(
  z.object({
    text: z.string(),
    bold: z.boolean().optional(),
    breakAfter: z.boolean().optional(),
  }),
);

const featureSchema = z.object({
  title: z.string().min(1),
  description: textRunsSchema,
  bullets: z.array(textRunsSchema).optional(),
  icon: z.enum(ICON_NAMES).nullish(),
});

const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string(),
});

const testimonialSchema = z.object({
  /** Runs, not a string: the live quote bolds phrases and breaks its own lines. */
  quote: textRunsSchema,
  author: z.string().min(1),
  location: z.string().optional(),
  role: z.string().optional(),
});

/** Fields every block carries. `id` must be unique within the page. */
const blockBase = {
  id: z.string().min(1),
  hidden: z.boolean().optional(),
};

const heroBlockSchema = z.object({
  ...blockBase,
  type: z.literal("hero"),
  eyebrow: z.string(),
  body: textRunsSchema,
  cta: ctaSchema,
  video: z.object({
    youtubeId: z.string().min(1),
    title: z.string(),
    poster: imageAssetSchema.nullable(),
  }),
});

const overviewBlockSchema = z.object({
  ...blockBase,
  type: z.literal("overview"),
  body: textRunsSchema,
  image: imageAssetSchema.nullable(),
  mediaSide: z.enum(["left", "right"]).optional(),
});

const featureGridBlockSchema = z.object({
  ...blockBase,
  type: z.literal("feature-grid"),
  anchorId: z.string().nullish(),
  eyebrow: z.string().nullish(),
  heading: z.string(),
  description: z.string().nullish(),
  headingLevel: z.enum(["h1", "h2"]).optional(),
  features: z.array(featureSchema),
  cta: ctaSchema.nullish(),
  ctaAfterEvery: z.number().int().positive().optional(),
});

const benefitMediaBlockSchema = z.object({
  ...blockBase,
  type: z.literal("benefit-media"),
  anchorId: z.string().nullish(),
  heading: z.string(),
  items: z.array(z.string()),
  image: imageAssetSchema.nullable(),
  mediaSide: z.enum(["left", "right"]).optional(),
});

const trialCtaBlockSchema = z.object({
  ...blockBase,
  type: z.literal("trial-cta"),
  anchorId: z.string().min(1),
  eyebrow: z.string().nullish(),
  heading: z.string(),
  /** Groups of paragraphs — see TrialCtaBlock for why it is nested. */
  body: z.array(z.array(textRunsSchema)),
  privacyNote: z.string(),
});

const testimonialsBlockSchema = z.object({
  ...blockBase,
  type: z.literal("testimonials"),
  anchorId: z.string().nullish(),
  heading: z.string(),
  items: z.array(testimonialSchema),
  cta: ctaSchema.nullish(),
});

const faqsBlockSchema = z.object({
  ...blockBase,
  type: z.literal("faqs"),
  anchorId: z.string().nullish(),
  eyebrow: z.string().nullish(),
  heading: z.string(),
  items: z.array(faqSchema),
  image: imageAssetSchema.nullish(),
  mediaSide: z.enum(["left", "right"]).optional(),
  closingHeading: z.string().nullish(),
  cta: ctaSchema.nullish(),
});

const ctaBannerBlockSchema = z.object({
  ...blockBase,
  type: z.literal("cta-banner"),
  heading: z.string(),
  body: z.string(),
  cta: ctaSchema,
});

const closingStatementBlockSchema = z.object({
  ...blockBase,
  type: z.literal("closing-statement"),
  intro: z.string(),
  /** Paragraphs of runs — the first forces its own line breaks. */
  statement: z.array(textRunsSchema),
});

const seoSchema = z.object({
  title: z.string().min(1),
  absoluteTitle: z.string().nullish(),
  description: z.string(),
  ogImage: imageAssetSchema.nullish(),
  noIndex: z.boolean().optional(),
});

const homeBlockSchema = z.discriminatedUnion("type", [
  heroBlockSchema,
  overviewBlockSchema,
  featureGridBlockSchema,
  benefitMediaBlockSchema,
  trialCtaBlockSchema,
  testimonialsBlockSchema,
  faqsBlockSchema,
  ctaBannerBlockSchema,
  closingStatementBlockSchema,
]);

const homePageContentSchema = z.object({
  path: z.string().startsWith("/"),
  seo: seoSchema,
  blocks: z.array(homeBlockSchema),
});

/**
 * Validates a CMS payload as home-page content.
 *
 * Returns null — never throws — so the caller can fall back to the committed
 * content. The reason is logged, because a build that silently ignores the CMS
 * is worse than one that says why it did.
 */
export function parseHomePageContent(payload: unknown): HomePageContent | null {
  const result = homePageContentSchema.safeParse(payload);

  if (!result.success) {
    console.warn(
      "[cms] Home page payload rejected:\n",
      JSON.stringify(z.treeifyError(result.error), null, 2),
    );
    return null;
  }

  return result.data;
}
