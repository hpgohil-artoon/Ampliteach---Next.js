import type { Post, PostHeading, PostSummary } from "@/types";
import { articleJsonLd } from "@/lib/seo";
import { Container, Section } from "@/components/common";
import { NewsletterForm } from "@/components/forms";
import { Separator } from "@/components/ui/separator";
import { PostBody, PostHeader, RelatedPosts, TableOfContents } from "./components";

/**
 * A single post. The route resolves `post` (and 404s when there isn't one), so
 * by the time this renders the post is known to exist.
 *
 * `headings` is extracted at build time, which is what lets the table of
 * contents ship as plain HTML — only its scroll-spy highlight is client-side.
 */
export function BlogPostPage({
  post,
  related,
  headings,
}: {
  post: Post;
  related: PostSummary[];
  headings: PostHeading[];
}) {
  return (
    <Section spacing="tight">
      {/* `post`, not the default: single posts are theme-rendered rather than
       * Elementor, so they are the one page type the live 1170px `.container`
       * actually applies to. */}
      <Container size="post" className="grid gap-12 lg:grid-cols-[1fr_220px]">
        <article className="flex min-w-0 flex-col gap-8">
          <PostHeader post={post} />
          <PostBody html={post.content} />

          <Separator />

          <aside className="bg-muted/40 flex flex-col gap-3 rounded-xl p-6">
            <h2 className="font-heading text-h5">Get new posts in your inbox</h2>
            <p className="text-muted-foreground text-sm">
              Occasional, practical ideas for music school owners. Unsubscribe any time.
            </p>
            <NewsletterForm />
          </aside>

          <RelatedPosts posts={related} />
        </article>

        <div className="hidden lg:block">
          <div className="sticky top-28">
            <TableOfContents headings={headings} />
          </div>
        </div>
      </Container>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(post)) }}
      />
    </Section>
  );
}
