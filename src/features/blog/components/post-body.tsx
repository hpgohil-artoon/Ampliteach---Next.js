import { withHeadingIds } from "@/lib/utils/headings";

/**
 * Renders CMS HTML.
 *
 * `dangerouslySetInnerHTML` is acceptable here only because the source is our
 * own trusted CMS. If content ever comes from an untrusted author, sanitise it
 * in the adapter (src/lib/cms) before it reaches this component.
 *
 * Prose styling is applied with explicit child selectors rather than
 * @tailwindcss/typography, to keep the dependency list short.
 *
 * Note what is NOT set here: heading size, weight and family. CMS HTML uses
 * bare <h2>/<h3> tags, which pick those up from the h1–h6 base rules in
 * globals.css — the same scale as the rest of the site, from one place. This
 * component only owns the prose rhythm (margins, list style, scroll offset).
 */
export function PostBody({ html }: { html: string }) {
  return (
    <div
      className="[&_a]:text-primary max-w-none text-base leading-relaxed [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:scroll-mt-24 [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:scroll-mt-24 [&_img]:my-6 [&_img]:rounded-lg [&_li]:mb-2 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
      dangerouslySetInnerHTML={{ __html: withHeadingIds(html) }}
    />
  );
}
