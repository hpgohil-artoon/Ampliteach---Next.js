import type { HomeBlock } from "@/types";
import { CtaBanner } from "@/components/common";
import {
  BenefitMedia,
  ClosingStatement,
  Faqs,
  FeatureGrid,
  Hero,
  Overview,
  Testimonials,
  TrialCta,
} from "./sections";

/**
 * Block → section. The one place a `type` string becomes a component.
 *
 * A `switch` rather than a lookup object on purpose: it narrows the union, so
 * every branch gets its exact block type with no cast, and adding a block type
 * without handling it here fails the build on the `never` below.
 */
export function SectionRenderer({ block }: { block: HomeBlock }) {
  switch (block.type) {
    case "hero":
      return <Hero block={block} />;
    case "overview":
      return <Overview block={block} />;
    case "feature-grid":
      return <FeatureGrid block={block} />;
    case "benefit-media":
      return <BenefitMedia block={block} />;
    case "trial-cta":
      return <TrialCta block={block} />;
    case "testimonials":
      return <Testimonials block={block} />;
    case "faqs":
      return <Faqs block={block} />;
    case "cta-banner":
      return <CtaBanner heading={block.heading} body={block.body} cta={block.cta} />;
    case "closing-statement":
      return <ClosingStatement block={block} />;
    default: {
      // Exhaustiveness check: if this stops compiling, a block type was added
      // to HomeBlock without a case above.
      const unhandled: never = block;
      return unhandled;
    }
  }
}
