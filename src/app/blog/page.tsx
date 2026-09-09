import { buildMetadata } from "@/lib/seo";
import { getAllPosts, getPosts } from "@/lib/api/posts";
import { Container, Section, SectionHeading } from "@/components/common";
import { BlogGrid, BlogPagination, BlogSearch } from "@/features/blog/components";

export const metadata = buildMetadata({
  title: "Blog",
  description:
    "Guides and ideas on running a music school — scheduling software, curriculum, retention, communication and growth.",
  path: "/blog",
});

export default async function BlogIndexPage() {
  // Both run at build time. `getAllPosts` also feeds the client-side search
  // index, since a static site has no search endpoint.
  const [{ posts, totalPages }, allPosts] = await Promise.all([getPosts(1), getAllPosts()]);

  return (
    <Section>
      <Container className="flex flex-col gap-12">
        <SectionHeading
          as="h1"
          eyebrow="Blog"
          title="Ideas for running a better music school"
          description="Practical guides on scheduling, curriculum, retention and growth."
        />

        <BlogSearch posts={allPosts} />
        <BlogGrid posts={posts} />
        <BlogPagination page={1} totalPages={totalPages} />
      </Container>
    </Section>
  );
}
