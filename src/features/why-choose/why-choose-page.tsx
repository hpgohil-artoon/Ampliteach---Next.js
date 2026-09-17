import type { WhyChoosePageContent } from "@/types";
import { SectionRenderer } from "./section-renderer";

/**
 * The why-choose page's outline.
 *
 * The order is not written here — it is `content.blocks`, which comes from the
 * CMS (or from the committed fallback in `src/content/why-choose.ts` until the
 * CMS is live). Editors reorder sections and switch them off, and this renders
 * whatever they published.
 *
 * `key` is the block's own id, not its index, so reordering moves the DOM nodes
 * instead of re-labelling them.
 */
export function WhyChoosePage({ content }: { content: WhyChoosePageContent }) {
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
