import type { PostSummary } from "@/types";
import { Container, Section, SectionHeading } from "@/components/common";
import { BlogGrid } from "./blog-grid";
import { BlogPagination } from "./blog-pagination";
import { BlogSearch } from "./blog-search";

/**
 * The blog listing, shared by /blog and /blog/page/N — the two differ only in
 * their heading, so the search + grid + pagination stack is written once here.
 *
 * `allPosts` feeds the client-side search index rather than the grid: a static
 * site has no search endpoint, so every post's title has to ship.
 */
export function BlogListing({
  eyebrow,
  title,
  description,
  posts,
  allPosts,
  page,
  totalPages,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  posts: PostSummary[];
  allPosts: PostSummary[];
  page: number;
  totalPages: number;
}) {
  return (
    <Section>
      <Container className="flex flex-col gap-12">
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} description={description} />

        <BlogSearch posts={allPosts} />
        <BlogGrid posts={posts} />
        <BlogPagination page={page} totalPages={totalPages} />
      </Container>
    </Section>
  );
}
