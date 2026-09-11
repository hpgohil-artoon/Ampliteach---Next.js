import Link from "next/link";
import type { HeroBlock } from "@/types";
import { Button } from "@/components/ui/button";
import { Container, RichText, TypedText, VideoEmbed } from "@/components/common";

/**
 * The hero — live section `9a677a2`, measured from its stylesheets.
 *
 *   outer section  full width, padding 50px 0 (unchanged at every breakpoint)
 *   inner section  boxed 1220px, items centred, z-index 5
 *   left column    padding 0 · padding-left 8% ≤1024 · full width, 0 ≤767
 *   right column   padding-left 20% · 0 20% 0 8% ≤1024 · full width, 0 ≤767
 *   eyebrow        44/56px, 800, letter-spacing −0.2px, brand red
 *                  32px/1.5 ≤1024 · 26px/1.6 ≤767 · margin-bottom 10px,
 *                  padding-right 10%
 *   paragraph      18px · 14px ≤767
 *   spacer         43px between paragraph and CTA
 *   CTA            margin 0 22px 20px 0 · 0 0 22px 0 ≤767
 *   bottom spacer  60px · 100px ≤1024 · 10px ≤767
 *
 * No heading element, deliberately: the live typed-text widget is a plain span
 * and the page's only `h1` lives in the feature-grid block.
 *
 * `font-body` is Roboto — what all 56 of the live page's text widgets declare.
 * Poppins is the nav and headings only. See deviation 17 in docs/PARITY.md.
 *
 * `Section` is not used here because the live section's 50px padding does not
 * follow the site's normal vertical rhythm. The trailing spacer is part of this
 * block, so the hero renders correctly wherever an editor puts it.
 */
export function Hero({ block }: { block: HeroBlock }) {
  return (
    <section className="py-[50px]">
      {/* `gutter={false}`: the live box is flush at 1220px and the inset comes
       * from the columns' own percentage padding. The `px-5` below 768px has
       * no live equivalent — the live text runs to the screen edge there.
       * Deviation 18 in docs/PARITY.md. */}
      <Container
        gutter={false}
        className="relative z-[5] grid items-center gap-0 px-5 md:grid-cols-2 md:px-0"
      >
        {/* `lg:`, not `xl:`, is the desktop step everywhere in this section.
         * Elementor's desktop rules are `min-width: 1025px`, so they map to
         * Tailwind's `lg` (1024px) — one pixel early, which is deviation 16.
         * `xl` is 1200px and would leave the tablet values in place across the
         * whole 1025–1199 band. */}
        <div className="font-body md:pl-[8%] lg:pl-0">
          <TypedText
            text={block.eyebrow}
            className="text-primary mb-[10px] block pr-[10%] text-[26px] leading-[1.6] font-extrabold tracking-[-0.2px] md:text-[32px] md:leading-[1.5] lg:text-[44px] lg:leading-[56px]"
          />

          {/* `leading-[1.6875]` is not decoration: Tailwind's `text-sm`/`text-lg`
           * ship their own paired line-heights (20px / 28px), but the live
           * site sets `p { line-height: 1.6875 }`, which is 23.6px at 14px and
           * 30.375px at 18px. Left to Tailwind's defaults the paragraph came
           * out 6px short over four lines and dragged the CTA 9px up. */}
          <p className="text-foreground text-sm leading-[1.6875] md:text-lg">
            <RichText runs={block.body} />
          </p>

          {/* The 43px spacer widget, then the CTA — which is `alignment_center`
           * on the live site, centred in its column rather than left-aligned,
           * with the widget's `margin: 0 22px 20px 0` pulling it 11px left of
           * true centre (0 0 22px 0 below 768px). */}
          <div className="mt-[43px] mb-[22px] text-center md:mr-[22px] md:mb-5">
            <Button asChild variant="wipe" size="cta">
              <Link href={block.cta.href}>{block.cta.label}</Link>
            </Button>
          </div>
        </div>

        <div className="md:pr-[20%] md:pl-[8%] lg:pr-0 lg:pl-[20%]">
          <VideoEmbed
            youtubeId={block.video.youtubeId}
            poster={block.video.poster}
            title={block.video.title}
          />
        </div>
      </Container>

      {/* The live bottom spacer: 60px desktop, 100px ≤1024, 10px ≤767. */}
      <div aria-hidden className="h-[10px] md:h-[100px] lg:h-[60px]" />
    </section>
  );
}
