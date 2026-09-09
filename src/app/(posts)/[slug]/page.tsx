import { notFound } from "next/navigation";
import { articleJsonLd, buildMetadata } from "@/lib/seo";
import { getPost, getPostSlugs, getRelatedPosts } from "@/lib/api/posts";
import { extractHeadings } from "@/lib/utils/headings";
import { Container, Section } from "@/components/common";
import { NewsletterForm } from "@/components/forms";
import { Separator } from "@/components/ui/separator";
import { PostBody, PostHeader, RelatedPosts, TableOfContents } from "@/features/blog/components";

/**
 * Blog posts sit at the domain ROOT — /best-music-school-scheduling-software/ —
 * mirroring the existing WordPress URLs so none of the indexed posts lose
 * their ranking. The (posts) route group adds no URL segment.
 *
 * `dynamicParams = false` is required for static export: only the slugs listed
 * by generateStaticParams exist, and anything else 404s.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

/** Explicit params type — see the note in blog/page/[page]/page.tsx. */
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post)
    return buildMetadata({ title: "Not found", description: "", path: `/${slug}`, noIndex: true });

  return buildMetadata({
    title: post.seo.title ?? post.title,
    description: post.seo.description ?? post.excerpt,
    path: `/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt ?? undefined,
    image: post.featuredImage
      ? {
          url: post.featuredImage.src,
          width: post.featuredImage.width,
          height: post.featuredImage.height,
          alt: post.featuredImage.alt,
        }
      : undefined,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const [related] = await Promise.all([getRelatedPosts(slug)]);
  const headings = extractHeadings(post.content);

  return (
    <Section spacing="tight">
      <Container className="grid gap-12 lg:grid-cols-[1fr_220px]">
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
