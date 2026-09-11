import type { PostSummary } from "@/types";
import { BlogListing } from "./components";

/** /blog/page/N — page 2 onwards. Page 1 is served by `BlogIndexPage`. */
export function BlogPaginatedPage({
  page,
  posts,
  allPosts,
  totalPages,
}: {
  page: number;
  posts: PostSummary[];
  allPosts: PostSummary[];
  totalPages: number;
}) {
  return (
    <BlogListing
      eyebrow={`Page ${page}`}
      title="Blog"
      posts={posts}
      allPosts={allPosts}
      page={page}
      totalPages={totalPages}
    />
  );
}
