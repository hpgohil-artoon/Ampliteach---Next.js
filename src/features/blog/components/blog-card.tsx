import Link from "next/link";
import type { PostSummary } from "@/types";
import { formatDate, toDateAttr } from "@/lib/utils/format";
import { ROUTES } from "@/lib/constants/routes";
import { Card, CardContent } from "@/components/ui/card";

export function BlogCard({ post }: { post: PostSummary }) {
  return (
    <Card className="group h-full overflow-hidden pt-0 transition-shadow hover:shadow-md">
      <Link href={ROUTES.post(post.slug)} className="flex h-full flex-col">
        {/* TODO: swap for <Img {...post.featuredImage} /> once CMS images are wired. */}
        <div className="bg-muted aspect-16/9 w-full" aria-hidden />

        <CardContent className="flex flex-1 flex-col gap-3">
          <p className="text-muted-foreground flex items-center gap-2 text-xs">
            <time dateTime={toDateAttr(post.publishedAt)}>{formatDate(post.publishedAt)}</time>
            <span aria-hidden>·</span>
            <span>{post.readTimeMinutes} min read</span>
          </p>

          <h3 className="font-heading group-hover:text-primary text-lg font-semibold text-balance transition-colors">
            {post.title}
          </h3>

          {post.excerpt ? (
            <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
              {post.excerpt}
            </p>
          ) : null}
        </CardContent>
      </Link>
    </Card>
  );
}
