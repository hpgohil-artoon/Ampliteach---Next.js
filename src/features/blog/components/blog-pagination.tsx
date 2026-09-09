import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { pageRange } from "@/lib/utils/pagination";
import { cn } from "@/lib/utils";

/**
 * Server-rendered pagination — every page is a real, crawlable URL
 * (/blog, /blog/page/2, …), which matters because the site is static.
 */
export function BlogPagination({ page, totalPages }: { page: number; totalPages: number }) {
  if (totalPages <= 1) return null;

  const pages = pageRange(page, totalPages);

  return (
    <nav aria-label="Blog pagination" className="flex items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link
          href={ROUTES.blogPage(page - 1)}
          rel="prev"
          aria-label="Previous page"
          className="hover:bg-muted inline-flex size-9 items-center justify-center rounded-md"
        >
          <ChevronLeft className="size-4" aria-hidden />
        </Link>
      ) : null}

      {pages.map((entry, index) =>
        entry === null ? (
          <span key={`gap-${index}`} className="text-muted-foreground px-2" aria-hidden>
            …
          </span>
        ) : (
          <Link
            key={entry}
            href={ROUTES.blogPage(entry)}
            aria-current={entry === page ? "page" : undefined}
            className={cn(
              "inline-flex size-9 items-center justify-center rounded-md text-sm tabular-nums",
              entry === page
                ? "bg-primary text-primary-foreground font-semibold"
                : "hover:bg-muted",
            )}
          >
            {entry}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link
          href={ROUTES.blogPage(page + 1)}
          rel="next"
          aria-label="Next page"
          className="hover:bg-muted inline-flex size-9 items-center justify-center rounded-md"
        >
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      ) : null}
    </nav>
  );
}
