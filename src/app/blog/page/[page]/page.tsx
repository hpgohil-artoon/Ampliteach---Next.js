import { notFound } from "next/navigation";
import { BlogPaginatedPage } from "@/features/blog";
import { buildMetadata } from "@/lib/seo";
import { getAllPosts, getPosts } from "@/lib/api/posts";
import { POSTS_PER_PAGE } from "@/lib/constants/routes";
import { totalPages as countPages } from "@/lib/utils/pagination";

/**
 * Prebuilds /blog/page/2, /blog/page/3, … from the post count.
 *
 * Static export requires every dynamic route to be enumerated here — there is
 * no server to render an unknown page on demand.
 */
export async function generateStaticParams() {
  const posts = await getAllPosts();
  const pages = countPages(posts.length, POSTS_PER_PAGE);

  // Page 1 is served by /blog, so start at 2.
  const params = Array.from({ length: Math.max(0, pages - 1) }, (_, index) => ({
    page: String(index + 2),
  }));

  // `output: export` rejects an empty array, which would happen whenever the
  // blog fits on a single page. Emit page 2 as a harmless empty state instead
  // of breaking the build. It is excluded from sitemap.xml either way.
  return params.length > 0 ? params : [{ page: "2" }];
}

/**
 * Params are typed explicitly rather than with the generated `PageProps`
 * global, so `npm run typecheck` works on a clean checkout before the first
 * `next build` has generated .next/types.
 */
type Props = { params: Promise<{ page: string }> };

export async function generateMetadata({ params }: Props) {
  const { page } = await params;

  return buildMetadata({
    title: `Blog — Page ${page}`,
    description: "Guides and ideas on running a music school.",
    path: `/blog/page/${page}`,
  });
}

export default async function Page({ params }: Props) {
  const { page: pageParam } = await params;
  const page = Number(pageParam);

  if (!Number.isInteger(page) || page < 2) notFound();

  const [{ posts, totalPages }, allPosts] = await Promise.all([getPosts(page), getAllPosts()]);

  return (
    <BlogPaginatedPage page={page} posts={posts} allPosts={allPosts} totalPages={totalPages} />
  );
}
