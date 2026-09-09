"use client";

import { useMemo } from "react";
import type { PostHeading } from "@/types";
import { useActiveHeading } from "@/hooks";
import { cn } from "@/lib/utils";

/**
 * The links are plain anchors rendered from build-time-extracted headings —
 * only the active-section highlight needs the client.
 */
export function TableOfContents({ headings }: { headings: PostHeading[] }) {
  const ids = useMemo(() => headings.map((heading) => heading.id), [headings]);
  const active = useActiveHeading(ids);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="On this page" className="flex flex-col gap-3">
      <h2 className="text-muted-foreground text-xs font-semibold tracking-[0.14em] uppercase">
        On this page
      </h2>
      <ul className="border-border flex flex-col gap-2 border-l text-sm">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={cn(
                "-ml-px block border-l-2 py-0.5 transition-colors",
                heading.level === 3 ? "pl-6" : "pl-3",
                active === heading.id
                  ? "border-primary text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground border-transparent",
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
