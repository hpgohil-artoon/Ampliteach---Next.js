import type { PostSummary } from "@/types";
import { BlogCard } from "./blog-card";

export function BlogGrid({ posts }: { posts: PostSummary[] }) {
  if (!posts.length) {
    return (
      <p className="text-muted-foreground py-12 text-center">
        No posts yet. Once the CMS is connected they will appear here.
      </p>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <li key={post.slug}>
          <BlogCard post={post} />
        </li>
      ))}
    </ul>
  );
}
