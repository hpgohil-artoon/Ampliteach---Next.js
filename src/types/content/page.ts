import type { ImageAsset } from "../common";

/**
 * The page-content contract.
 *
 * Every marketing page is `seo` plus an ORDERED, TOGGLEABLE list of blocks.
 * That is the shape the CMS must serve (see docs/CMS-CONTRACT.md) and the shape
 * the committed fallback content in `src/content/` is written in, so the same
 * code path renders both and there is nothing to change on the day the CMS
 * goes live.
 */

/** What the CMS controls about a page's Google/social listing. */
export type SeoContent = {
  /** Runs through the "%s | AmpliTeach" title template. */
  title: string;
  /** Set to bypass the template entirely — the home page does. */
  absoluteTitle?: string | null;
  description: string;
  /** Falls back to the site-wide OG image when null. */
  ogImage?: ImageAsset | null;
  noIndex?: boolean;
};

/**
 * Fields every block carries.
 *
 * `id` is the React key and the CMS's own row id — it must be stable across
 * publishes and unique within the page, because reordering is keyed on it.
 * `hidden` is how an editor turns a section off without deleting its content.
 */
export type BlockBase = {
  id: string;
  hidden?: boolean;
};

/** A page: SEO plus its blocks, in the order the CMS returned them. */
export type PageContent<TBlock> = {
  /** Route path with a leading slash, e.g. "/" or "/pricing". */
  path: string;
  seo: SeoContent;
  blocks: TBlock[];
};
