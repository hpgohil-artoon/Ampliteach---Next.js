import type { HomePageContent } from "@/types";
import { SectionRenderer } from "./section-renderer";

/**
 * The home page's outline.
 *
 * The order is no longer written here — it is `content.blocks`, which comes
 * from the CMS (or from the committed fallback in `src/content/home.ts` until
 * the CMS is live). Editors reorder sections and switch them off, and this
 * renders whatever they published.
 *
 * `key` is the block's own id, not its index, so reordering moves the DOM
 * nodes instead of re-labelling them.
 */
export function HomePage({ content }: { content: HomePageContent }) {
  return (
    <>
      {content.blocks
        .filter((block) => !block.hidden)
        .map((block) => (
          <SectionRenderer key={block.id} block={block} />
        ))}
    </>
  );
}
