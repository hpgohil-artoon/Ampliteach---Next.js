import type { PostSummary } from "@/types";
import { BlogListing } from "./components";

/** /blog — page 1 of the listing. */
export function BlogIndexPage({
  posts,
  allPosts,
  totalPages,
}: {
  posts: PostSummary[];
  allPosts: PostSummary[];
  totalPages: number;
}) {
  return (
    <BlogListing
      eyebrow="Blog"
      title="Ideas for running a better music school"
      description="Practical guides on scheduling, curriculum, retention and growth."
      posts={posts}
      allPosts={allPosts}
      page={1}
      totalPages={totalPages}
    />
  );
}
