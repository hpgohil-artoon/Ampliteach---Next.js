"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { PostSummary } from "@/types";
import { ROUTES } from "@/lib/constants/routes";
import { Input } from "@/components/ui/input";

/**
 * Client-side search over an index baked into the page at build time.
 *
 * A static site has no search endpoint, so the full post list (titles and
 * excerpts only — see PostSummary) is passed in as a prop and filtered in the
 * browser. Fine at 13 posts; revisit if the blog passes a few hundred.
 */
export function BlogSearch({ posts }: { posts: PostSummary[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (term.length < 2) return [];

    return posts
      .filter(
        (post) =>
          post.title.toLowerCase().includes(term) || post.excerpt.toLowerCase().includes(term),
      )
      .slice(0, 8);
  }, [posts, query]);

  return (
    <div className="relative mx-auto w-full max-w-md">
      <Search
        className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
        aria-hidden
      />
      <Input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search the blog"
        aria-label="Search the blog"
        className="pl-9"
      />

      {results.length > 0 ? (
        <ul className="bg-popover border-border absolute top-full z-20 mt-2 w-full overflow-hidden rounded-lg border shadow-lg">
          {results.map((post) => (
            <li key={post.slug}>
              <Link
                href={ROUTES.post(post.slug)}
                className="hover:bg-muted block px-4 py-2.5 text-sm"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      {query.trim().length >= 2 && results.length === 0 ? (
        <p className="text-muted-foreground mt-2 text-sm">No posts match “{query}”.</p>
      ) : null}
    </div>
  );
}
