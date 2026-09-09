import type { PaginatedPosts, Post, PostSummary } from "@/types";
import { env } from "@/config/env";
import { POSTS_PER_PAGE } from "@/lib/constants/routes";
import { toPost, toPostSummary, type WpPost } from "@/lib/cms";
import { SEED_POSTS, seedPost, seedPostSummary } from "@/content/seed-posts";
import { paginate, totalPages } from "@/lib/utils/pagination";
import { apiGet, apiGetWithHeaders } from "./client";

const TAG = "posts";

/**
 * Blog data access.
 *
 * Under static export all of this runs at BUILD time. A CMS publish therefore
 * needs a CI rebuild to appear — the CMS webhook should hit the deploy pipeline
 * rather than /api/revalidate. That is the one real cost of the S3 target.
 *
 * Every function degrades to an empty result if CMS_API_URL is unset, so the
 * project builds and runs before the CMS decision is finalised.
 */
function cmsConfigured(): boolean {
  return Boolean(env.CMS_API_URL);
}

function postsUrl(): string {
  return `${env.CMS_API_URL}/posts`;
}

export async function getPosts(page = 1, perPage = POSTS_PER_PAGE): Promise<PaginatedPosts> {
  if (!cmsConfigured()) {
    const all = SEED_POSTS.map(seedPostSummary);
    return {
      posts: paginate(all, page, perPage),
      page,
      totalPages: totalPages(all.length, perPage),
      totalPosts: all.length,
    };
  }

  const { data, headers } = await apiGetWithHeaders<WpPost[]>(postsUrl(), {
    tags: [TAG],
    searchParams: {
      page,
      per_page: perPage,
      _embed: "wp:featuredmedia,wp:term",
      orderby: "date",
      order: "desc",
    },
  });

  return {
    posts: data.map(toPostSummary),
    page,
    totalPages: Number(headers.get("x-wp-totalpages") ?? 1),
    totalPosts: Number(headers.get("x-wp-total") ?? data.length),
  };
}

/** Every post, for generateStaticParams and the client-side search index. */
export async function getAllPosts(): Promise<PostSummary[]> {
  if (!cmsConfigured()) return SEED_POSTS.map(seedPostSummary);

  const all: PostSummary[] = [];
  let page = 1;
  let pages = 1;

  do {
    const { data, headers } = await apiGetWithHeaders<WpPost[]>(postsUrl(), {
      tags: [TAG],
      searchParams: {
        page,
        per_page: 100,
        _embed: "wp:featuredmedia,wp:term",
        orderby: "date",
        order: "desc",
      },
    });

    all.push(...data.map(toPostSummary));
    pages = Number(headers.get("x-wp-totalpages") ?? 1);
    page += 1;
  } while (page <= pages);

  return all;
}

export async function getPostSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map((post) => post.slug);
}

export async function getPost(slug: string): Promise<Post | null> {
  if (!cmsConfigured()) {
    const seed = SEED_POSTS.find((post) => post.slug === slug);
    return seed ? seedPost(seed) : null;
  }

  const data = await apiGet<WpPost[]>(postsUrl(), {
    tags: [TAG, `post:${slug}`],
    searchParams: { slug, _embed: "wp:featuredmedia,wp:term" },
  });

  return data[0] ? toPost(data[0]) : null;
}

/** Three most recent other posts, preferring shared categories. */
export async function getRelatedPosts(slug: string, limit = 3): Promise<PostSummary[]> {
  const [all, current] = await Promise.all([getAllPosts(), getPost(slug)]);
  const others = all.filter((post) => post.slug !== slug);

  if (!current?.categories.length) return others.slice(0, limit);

  const scored = others
    .map((post) => ({
      post,
      shared: post.categories.filter((category) => current.categories.includes(category)).length,
    }))
    .sort((a, b) => b.shared - a.shared);

  return scored.slice(0, limit).map((entry) => entry.post);
}
