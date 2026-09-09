import type { Post } from "@/types";
import { formatDate, toDateAttr } from "@/lib/utils/format";
import { ROUTES } from "@/lib/constants/routes";
import { Breadcrumbs } from "@/components/layout";

export function PostHeader({ post }: { post: Post }) {
  return (
    <header className="flex flex-col gap-5">
      <Breadcrumbs
        items={[
          { label: "Home", href: ROUTES.home },
          { label: "Blog", href: ROUTES.blog },
          { label: post.title },
        ]}
      />

      <h1 className="font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
        {post.title}
      </h1>

      <p className="text-muted-foreground flex items-center gap-2 text-sm">
        <time dateTime={toDateAttr(post.publishedAt)}>{formatDate(post.publishedAt)}</time>
        <span aria-hidden>·</span>
        <span>{post.readTimeMinutes} min read</span>
      </p>
    </header>
  );
}
