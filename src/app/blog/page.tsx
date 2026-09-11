import { BlogIndexPage } from "@/features/blog";
import { buildMetadata } from "@/lib/seo";
import { getAllPosts, getPosts } from "@/lib/api/posts";

export const metadata = buildMetadata({
  title: "Blog",
  description:
    "Guides and ideas on running a music school — scheduling software, curriculum, retention, communication and growth.",
  path: "/blog",
});

export default async function Page() {
  // Both run at build time. `getAllPosts` also feeds the client-side search
  // index, since a static site has no search endpoint.
  const [{ posts, totalPages }, allPosts] = await Promise.all([getPosts(1), getAllPosts()]);

  return <BlogIndexPage posts={posts} allPosts={allPosts} totalPages={totalPages} />;
}
