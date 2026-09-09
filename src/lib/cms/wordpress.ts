import type { Post, PostSummary } from "@/types";
import { readTime, stripHtml, truncate } from "@/lib/utils/format";

/** The subset of the WordPress REST payload we actually read. */
export type WpPost = {
  id: number;
  slug: string;
  date_gmt: string;
  modified_gmt: string | null;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  yoast_head_json?: {
    title?: string;
    description?: string;
    og_description?: string;
  };
  _embedded?: {
    "wp:featuredmedia"?: {
      source_url: string;
      alt_text: string;
      media_details?: { width: number; height: number };
    }[];
    "wp:term"?: { name: string; taxonomy: string }[][];
  };
};

/**
 * Maps a WordPress post onto our own `Post` shape.
 *
 * This function is the entire blast radius of a CMS change: swap WordPress for
 * Sanity and only this file is rewritten. Nothing above the data layer ever
 * sees `title.rendered`.
 */
export function toPost(wp: WpPost): Post {
  const media = wp._embedded?.["wp:featuredmedia"]?.[0];
  const categories =
    wp._embedded?.["wp:term"]
      ?.flat()
      .filter((term) => term.taxonomy === "category")
      .map((term) => term.name) ?? [];

  const content = wp.content.rendered;

  return {
    id: String(wp.id),
    slug: wp.slug,
    title: stripHtml(wp.title.rendered).trim(),
    excerpt: truncate(stripHtml(wp.excerpt.rendered).trim()),
    content,
    featuredImage: media
      ? {
          src: media.source_url,
          alt: media.alt_text || stripHtml(wp.title.rendered).trim(),
          width: media.media_details?.width ?? 1200,
          height: media.media_details?.height ?? 630,
        }
      : null,
    publishedAt: `${wp.date_gmt}Z`,
    updatedAt: wp.modified_gmt ? `${wp.modified_gmt}Z` : null,
    readTimeMinutes: readTime(content),
    categories,
    seo: {
      title: wp.yoast_head_json?.title ?? null,
      description: wp.yoast_head_json?.description ?? wp.yoast_head_json?.og_description ?? null,
    },
  };
}

/** Card-sized projection — drops the body and SEO block to keep pages small. */
export function toPostSummary(wp: WpPost): PostSummary {
  const post = toPost(wp);

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    readTimeMinutes: post.readTimeMinutes,
    categories: post.categories,
  };
}
