import type { PostHeading } from "@/types";
import { slugify, stripHtml } from "./format";

/**
 * Pulls H2/H3s out of post HTML for the table of contents, and stamps a
 * matching `id` on each so the anchors resolve.
 *
 * Done at build time in a Server Component, so the TOC ships as plain HTML —
 * only the scroll-spy highlight is client-side.
 */
export function extractHeadings(html: string): PostHeading[] {
  const headings: PostHeading[] = [];
  const seen = new Map<string, number>();
  const pattern = /<h([23])[^>]*>(.*?)<\/h\1>/gi;

  let match: RegExpExecArray | null;
  while ((match = pattern.exec(html)) !== null) {
    const text = stripHtml(match[2]).trim();
    if (!text) continue;

    const base = slugify(text) || "section";
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);

    headings.push({
      id: count === 0 ? base : `${base}-${count}`,
      text,
      level: Number(match[1]) as 2 | 3,
    });
  }

  return headings;
}

/** Rewrites the same headings with the ids `extractHeadings` generated. */
export function withHeadingIds(html: string): string {
  const ids = extractHeadings(html).map((h) => h.id);
  let i = 0;

  return html.replace(/<h([23])([^>]*)>/gi, (full, level, attrs) => {
    const id = ids[i++];
    if (!id || /\sid=/i.test(attrs)) return full;
    return `<h${level}${attrs} id="${id}">`;
  });
}
