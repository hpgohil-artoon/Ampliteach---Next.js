import type { WhyChooseBlock } from "@/types";
import { PageBanner } from "@/components/common";
import { CenteredIntro, FounderMessage, MediaIntro, PitchRows, TintedCards } from "./sections";

/**
 * Block → section. The one place a `type` string becomes a component.
 *
 * A `switch` rather than a lookup object on purpose: it narrows the union, so
 * every branch gets its exact block type with no cast, and adding a block type
 * without handling it here fails the build on the `never` below.
 */
export function SectionRenderer({ block }: { block: WhyChooseBlock }) {
  switch (block.type) {
    case "page-banner":
      return <PageBanner heading={block.heading} breadcrumbs={block.breadcrumbs} />;
    case "media-intro":
      return <MediaIntro block={block} />;
    case "pitch-rows":
      return <PitchRows block={block} />;
    case "founder-message":
      return <FounderMessage block={block} />;
    case "centered-intro":
      return <CenteredIntro block={block} />;
    case "tinted-cards":
      return <TintedCards block={block} />;
    default: {
      // Exhaustiveness check: if this stops compiling, a block type was added
      // to WhyChooseBlock without a case above.
      const unhandled: never = block;
      return unhandled;
    }
  }
}
