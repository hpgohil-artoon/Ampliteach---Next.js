import type { ImageAsset } from "./common";

/**
 * Normalised blog post. Whatever CMS we end up with, the adapter in
 * src/lib/cms maps into this shape so nothing above the data layer has to
 * know about WordPress field names.
 */
export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Sanitised HTML body. */
  content: string;
  featuredImage: ImageAsset | null;
  /** ISO 8601. */
  publishedAt: string;
  updatedAt: string | null;
  readTimeMinutes: number;
  categories: string[];
  seo: {
    title: string | null;
    description: string | null;
  };
};

/** Card-sized subset used by listings — no body, so payloads stay small. */
export type PostSummary = Omit<Post, "content" | "seo">;

export type PostHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type PaginatedPosts = {
  posts: PostSummary[];
  page: number;
  totalPages: number;
  totalPosts: number;
};
