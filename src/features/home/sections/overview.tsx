import type { OverviewBlock } from "@/types";
import { cn } from "@/lib/utils";
import { Container, Img, RichText } from "@/components/common";

/**
 * The dashboard screenshot beside the product paragraph — live section
 * `11fd155`, measured from its stylesheets.
 *
 *   outer section   full width, `padding: 50px 0` at every breakpoint
 *   inner section   boxed 1220px, flush, items centred, `z-index: 5`
 *   image column    padding 0 · `0 20% 0 8%` ≤1024 · `0 20px 20px` ≤767
 *   — the image     `width: 80%`, in a wrapper with `padding-right: 15px`
 *   text column     no padding · `padding-left: 8%` ≤1024 · 0 ≤767
 *   paragraph       18px `#0B0B0B` · 14px ≤767
 *   spacer          60px · 100px ≤1024 · 10px ≤767
 *
 * No heading, matching the live section — the page's only `h1` is the feature
 * grid's. `font-body` is the unloaded `Roboto, sans-serif` stack the live text
 * widgets declare, and `leading-[1.6875]` is the live `p` line-height, which
 * Tailwind's `text-sm`/`text-lg` would otherwise override with their own.
 *
 * `Section` is not used: the live section's flat 50px padding does not follow
 * the site's vertical rhythm.
 */
export function Overview({ block }: { block: OverviewBlock }) {
  const mediaFirst = block.mediaSide !== "right";

  return (
    <section className="py-[50px]">
      <Container gutter={false} className="relative z-[5] grid items-center gap-0 md:grid-cols-2">
        {block.image ? (
          <div
            className={cn(
              "px-5 pb-5 md:pr-[20%] md:pb-0 md:pl-[8%] lg:p-0",
              mediaFirst ? "md:order-1" : "md:order-2",
            )}
          >
            <div className="pr-[15px]">
              <Img
                src={block.image.src}
                alt={block.image.alt}
                width={block.image.width}
                height={block.image.height}
                className="h-auto w-4/5"
              />
            </div>
          </div>
        ) : null}

        {/* `lg:p-[10px]` is Elementor's default column gap, which this column
         * keeps: the live CSS zeroes the padding on the image column but only
         * resets `margin` on this one, so it inherits
         * `.elementor-column-gap-default > .elementor-column >
         * .elementor-element-populated { padding: 10px }`. Without it the text
         * starts 10px left of live and wraps 20px wider. */}
        <div
          className={cn(
            "font-body text-foreground p-0 md:pl-[8%] lg:p-[10px]",
            mediaFirst ? "md:order-2" : "md:order-1",
          )}
        >
          <p className="text-sm leading-[1.6875] md:text-lg">
            <RichText runs={block.body} />
          </p>
        </div>
      </Container>

      {/* The live spacer widget that closes the section. */}
      <div aria-hidden className="h-[10px] md:h-[100px] lg:h-[60px]" />
    </section>
  );
}
