import type { Metadata } from "next";
import type { SeoContent } from "@/types";
import { buildMetadata } from "./metadata";

/**
 * Page metadata from CMS-editable content.
 *
 * Routes no longer spell their own title and description out — they hand this
 * the same content object they render, so a title changed in the CMS changes
 * the `<title>`, the canonical OG tags and the page in one edit.
 *
 * `absoluteTitle` bypasses the "%s | AmpliTeach" template, which the home page
 * needs: its live title is the full string, not a suffixed one.
 */
export function buildPageMetadata({ path, seo }: { path: string; seo: SeoContent }): Metadata {
  const metadata = buildMetadata({
    title: seo.title,
    description: seo.description,
    path,
    ...(seo.ogImage
      ? {
          image: {
            url: seo.ogImage.src,
            width: seo.ogImage.width,
            height: seo.ogImage.height,
            alt: seo.ogImage.alt,
          },
        }
      : {}),
    noIndex: seo.noIndex ?? false,
  });

  return seo.absoluteTitle ? { ...metadata, title: { absolute: seo.absoluteTitle } } : metadata;
}
