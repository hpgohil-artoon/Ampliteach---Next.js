import type { Metadata } from "next";
import { env } from "@/config/env";
import { SITE } from "@/content/site";

type BuildMetadataArgs = {
  title: string;
  description: string;
  /** Path with a leading slash, e.g. "/pricing". Used for the canonical URL. */
  path: string;
  image?: { url: string; width?: number; height?: number; alt?: string };
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
};

const DEFAULT_OG_IMAGE = {
  url: "/og-default.png",
  width: 1200,
  height: 630,
  alt: `${SITE.name} — ${SITE.tagline}`,
};

/**
 * One helper for every page's metadata, so canonical URLs, OG tags and the
 * title template can never drift between routes.
 *
 * Usage in a page file:
 *   export const metadata = buildMetadata({ title: "…", description: "…", path: "/pricing" })
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  noIndex = false,
}: BuildMetadataArgs): Metadata {
  const url = new URL(path, env.NEXT_PUBLIC_SITE_URL).toString();
  const ogImage = image ?? DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      type,
      images: [ogImage],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
      site: "@ampliteach",
    },
  };
}
