import type { MediaIntroBlock } from "@/types";
import { cn } from "@/lib/utils";
import { Container, Img, Reveal, RichText } from "@/components/common";

/**
 * The illustration beside the opening heading — live section `144d110`,
 * measured from its stylesheets.
 *
 *   section      background #FFF8F8
 *                padding 40px 0 60px  ·  60px 0 40px ≤1024  ·  20px 0 80px ≤767
 *   container    the Elementor boxed 1220 (see `gutter="elementor"`)
 *   media column width 40%  ·  100% ≤1024
 *                padding-top 20px, margin-left −5px  ·  30px 0 0 ≤767 ONLY
 *                (no tablet rule, so 768–1024 inherits the desktop 20px)
 *   text column  width 60%, padding 0 30px 0 40px  ·  0 15px ≤1024  ·  0 ≤767
 *   spacer       40px above the heading  ·  0 ≤1024  ·  10px ≤767
 *   heading      30px/38px, weight 800, brand red, margin-bottom 22px
 *                28px/40px ≤767
 *   paragraph    16px/28px, JUSTIFIED
 *   spacer       30px below, hidden on tablet
 *
 * Animations, from the live `data-settings`: the media column slides in from
 * the right and the illustration zooms in inside it (`animated-slow`, 5ms
 * delay); the heading and the paragraph both slide in from the left.
 *
 * `desktop:` — NOT `lg:` — is Elementor's desktop step. It is `min-width:
 * 1025px`, and here it decides whether this section is one column or two, so
 * the one-pixel difference is a whole different layout at 1024px. See the
 * variant's definition in globals.css.
 *
 * The section owns its own ground and its own vertical padding, so it renders
 * correctly wherever an editor puts it.
 */
export function MediaIntro({ block }: { block: MediaIntroBlock }) {
  const mediaFirst = (block.mediaSide ?? "left") === "left";

  return (
    <section className="bg-blush-warm desktop:pt-10 desktop:pb-[60px] relative z-[1] pt-5 pb-20 md:pt-[60px] md:pb-10">
      <Container gutter="elementor" className="desktop:grid-cols-[40%_60%] grid items-center gap-0">
        {block.image && (
          <Reveal
            animation="slide-in-right"
            /* `-ml-5px` is the live column's own negative margin. `mr-[5px]`
             * cancels the width a stretched grid item would otherwise gain from
             * it, so the column stays exactly 40% (488px at 1220) and only
             * MOVES — which is what a margin does to a sized block. */
            className={cn(
              /* The live column's −5px margin applies from 768 up only; at
               * mobile the column sits flush. `mr-[5px]` cancels the width a
               * stretched grid item would gain, so the column MOVES rather than
               * grows — what a margin does to a sized block. */
              /* `pt-5` from 768 UP, not just on desktop: the live column
               * declares `padding: 20px 0 0` at desktop and `30px 0 0` at
               * mobile, with no tablet rule — so tablet INHERITS the desktop
               * 20px. Treating 30px as the tablet value left the section 10px
               * tall at 768, and the page 10px with it. */
              "pt-[30px] md:mt-0 md:mr-[5px] md:-ml-[5px] md:pt-5",
              !mediaFirst && "desktop:order-2",
            )}
          >
            <Reveal animation="zoom-in" slow delayMs={5}>
              {/* NOT `w-full`: the live image has no width of its own, only
               * `max-width:100%`. So it is capped to 488px by the 40% column on
               * desktop, but on tablet — where the column is full width — it
               * renders at its natural 872px and centres, rather than stretching
               * to 1018px. */}
              <Img
                src={block.image.src}
                alt={block.image.alt}
                width={block.image.width}
                height={block.image.height}
                className="mx-auto h-auto max-w-full"
              />
            </Reveal>
          </Reveal>
        )}

        <div
          className={cn(
            "desktop:pr-[30px] desktop:pl-10 md:px-[15px]",
            !mediaFirst && "desktop:order-1",
          )}
        >
          {/* The live copy sits in an INNER Elementor section nested in this
           * column, and that nesting adds its own gutter: 10px left and 30px
           * right on tablet, where it narrows the copy from 988 to 948. On
           * desktop the column's own 40/30 padding already accounts for it, so
           * this wrapper contributes nothing there. */}
          <div className="desktop:p-0 p-[10px] md:pr-[30px] md:pl-[10px]">
            {/* The live spacer widget above the heading. */}
            <div aria-hidden className="desktop:h-10 h-[10px] md:h-0" />

            <Reveal animation="slide-in-left">
              <h2 className="text-primary mb-[22px] text-[28px] leading-[40px] font-extrabold md:text-[30px] md:leading-[38px]">
                {block.heading}
              </h2>
            </Reveal>

            <Reveal animation="slide-in-left">
              <p className="text-foreground text-justify text-base leading-[28px]">
                <RichText runs={block.body} />
              </p>
            </Reveal>

            {/* The live trailing spacer, which carries `elementor-hidden-tablet`. */}
            <div aria-hidden className="desktop:h-[30px] h-[30px] md:h-0" />
          </div>
        </div>
      </Container>
    </section>
  );
}
