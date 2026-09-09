import type { Post, PostSummary } from "@/types";

/**
 * The 13 live post URLs, committed.
 *
 * Two jobs:
 *  1. They are the canonical list of indexed URLs that MUST keep working after
 *     the migration — these slugs sit at the domain root, not under /blog.
 *  2. Under `output: export` a dynamic route has to generate at least one path,
 *     so before CMS_API_URL is configured these seed the build. Once the CMS is
 *     connected, src/lib/api/posts.ts ignores this file entirely.
 *
 * Titles and dates are from the live site. Bodies are placeholders — real
 * content comes from the CMS.
 */
type Seed = {
  slug: string;
  title: string;
  publishedAt: string;
  readTimeMinutes: number;
};

export const SEED_POSTS: Seed[] = [
  {
    slug: "best-music-school-scheduling-software",
    title: "The Ultimate Guide to Choosing Music School Scheduling Software",
    publishedAt: "2026-02-17T11:41:13Z",
    readTimeMinutes: 6,
  },
  {
    slug: "maximizing-efficiency-in-music-school",
    title: "Maximizing Efficiency in Your Music School: The Power of Email and Text Alerts",
    publishedAt: "2026-02-17T11:40:22Z",
    readTimeMinutes: 4,
  },
  {
    slug: "top-music-school-management-software",
    title: "Best Music School Management Software for 2026",
    publishedAt: "2026-02-17T11:40:59Z",
    readTimeMinutes: 5,
  },
  {
    slug: "music-school-curriculum",
    title: "How to Integrate Digital Tools into Your Music School Curriculum",
    publishedAt: "2026-01-28T00:00:00Z",
    readTimeMinutes: 5,
  },
  {
    slug: "smartest-move-for-music-school",
    title: "Why Switching to AmpliTeach Is the Smartest Move for Your Music School",
    publishedAt: "2026-01-08T00:00:00Z",
    readTimeMinutes: 4,
  },
  {
    slug: "music-school-software-for-growth",
    title:
      "Elevating Your Music School or Studio: Strategies for Efficiency and Growth in 2026 with AmpliTeach",
    publishedAt: "2026-01-05T00:00:00Z",
    readTimeMinutes: 5,
  },
  {
    slug: "best-music-lesson-scheduling-app",
    title: "Choosing the Best Music Lesson Scheduling App",
    publishedAt: "2026-02-17T11:09:01Z",
    readTimeMinutes: 5,
  },
  {
    slug: "music-studio-management-software",
    title: "Music Studio Management Software: What to Look For",
    publishedAt: "2026-02-17T11:08:02Z",
    readTimeMinutes: 5,
  },
  {
    slug: "best-music-school-management-software",
    title: "The Best Music School Management Software",
    publishedAt: "2026-01-21T12:47:22Z",
    readTimeMinutes: 5,
  },
  {
    slug: "music-school-management",
    title: "Music School Management: A Practical Overview",
    publishedAt: "2026-01-21T12:46:40Z",
    readTimeMinutes: 4,
  },
  {
    slug: "music-school-management-features",
    title: "The Features Every Music School Management Platform Needs",
    publishedAt: "2026-01-21T12:45:54Z",
    readTimeMinutes: 4,
  },
  {
    slug: "music-education-management-software",
    title: "Music Education Management Software Explained",
    publishedAt: "2026-01-21T12:45:11Z",
    readTimeMinutes: 4,
  },
  {
    slug: "music-school-software",
    title: "Music School Software: Where to Start",
    publishedAt: "2026-01-21T12:44:22Z",
    readTimeMinutes: 4,
  },
];

const PLACEHOLDER_BODY = `
<p>This post's content is served from the CMS. Set <code>CMS_API_URL</code> in
your environment to pull the real body, and this placeholder disappears.</p>
<h2>Why this page exists</h2>
<p>Static export requires every dynamic route to be enumerated at build time,
so the project ships with the live post URLs seeded. That keeps the build green
before the CMS decision is finalised, and guarantees these indexed URLs survive
the migration.</p>
<h2>What replaces it</h2>
<p>Once the CMS is connected, <code>src/lib/api/posts.ts</code> reads from it and
never touches this file.</p>
`;

export function seedPostSummary(seed: Seed): PostSummary {
  return {
    id: seed.slug,
    slug: seed.slug,
    title: seed.title,
    excerpt: "Content for this post comes from the CMS once it is connected.",
    featuredImage: null,
    publishedAt: seed.publishedAt,
    updatedAt: null,
    readTimeMinutes: seed.readTimeMinutes,
    categories: [],
  };
}

export function seedPost(seed: Seed): Post {
  return {
    ...seedPostSummary(seed),
    content: PLACEHOLDER_BODY,
    seo: { title: null, description: null },
  };
}
