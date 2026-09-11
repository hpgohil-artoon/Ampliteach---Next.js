import { notFound } from "next/navigation";
import { BlogPostPage } from "@/features/blog";
import { buildMetadata } from "@/lib/seo";
import { getPost, getPostSlugs, getRelatedPosts } from "@/lib/api/posts";
import { extractHeadings } from "@/lib/utils/headings";

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

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const [related] = await Promise.all([getRelatedPosts(slug)]);
  const headings = extractHeadings(post.content);

  return <BlogPostPage post={post} related={related} headings={headings} />;
}
