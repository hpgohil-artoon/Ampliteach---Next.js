import type { MetadataRoute } from "next";
import { env } from "@/config/env";
import { getAllPosts } from "@/lib/api/posts";
import { POSTS_PER_PAGE, ROUTES } from "@/lib/constants/routes";
import { totalPages } from "@/lib/utils/pagination";

/**
 * Generated, never hand-maintained — a new page or post appears here
 * automatically. Works under static export: Next writes sitemap.xml at build.
 *
 * `force-static` is REQUIRED under `output: export`. Next compiles sitemap.ts
 * into a route handler, and because this one awaits a fetch it is treated as
 * dynamic unless told otherwise — which fails the export build.
 */
export const dynamic = "force-static";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const url = (path: string) => `${base}${path === "/" ? "/" : `${path}/`}`;

  const staticPages: MetadataRoute.Sitemap = [
    { url: url(ROUTES.home), priority: 1, changeFrequency: "monthly" },
    { url: url(ROUTES.whyChooseUs), priority: 0.8, changeFrequency: "monthly" },
    { url: url(ROUTES.featuresAndBenefits), priority: 0.8, changeFrequency: "monthly" },
    { url: url(ROUTES.pricing), priority: 0.9, changeFrequency: "weekly" },
    { url: url(ROUTES.littleRockers), priority: 0.6, changeFrequency: "monthly" },
    { url: url(ROUTES.contact), priority: 0.7, changeFrequency: "yearly" },
    { url: url(ROUTES.blog), priority: 0.8, changeFrequency: "weekly" },
    { url: url(ROUTES.privacyPolicy), priority: 0.2, changeFrequency: "yearly" },
    { url: url(ROUTES.termsOfService), priority: 0.2, changeFrequency: "yearly" },
  ];

  const posts = await getAllPosts();

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: url(ROUTES.post(post.slug)),
    lastModified: post.updatedAt ?? post.publishedAt,
    priority: 0.7,
    changeFrequency: "monthly",
  }));

  const pageCount = totalPages(posts.length, POSTS_PER_PAGE);
  const paginationPages: MetadataRoute.Sitemap = Array.from(
    { length: Math.max(0, pageCount - 1) },
    (_, index) => ({
      url: url(ROUTES.blogPage(index + 2)),
      priority: 0.4,
      changeFrequency: "weekly" as const,
    }),
  );

  return [...staticPages, ...postPages, ...paginationPages];
}
