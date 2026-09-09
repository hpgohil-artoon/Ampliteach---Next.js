import type { PostSummary } from "@/types";
import { BlogCard } from "./blog-card";

export function RelatedPosts({ posts }: { posts: PostSummary[] }) {
  if (!posts.length) return null;

  return (
    <section aria-labelledby="related-posts" className="flex flex-col gap-6">
      <h2 id="related-posts" className="font-heading text-2xl font-bold tracking-tight">
        Related reading
      </h2>
      <ul className="grid gap-6 sm:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <BlogCard post={post} />
          </li>
        ))}
      </ul>
    </section>
  );
}
