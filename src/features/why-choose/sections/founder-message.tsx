import type { FounderMessageBlock } from "@/types";
import { cn } from "@/lib/utils";
import { Container, Img, Reveal, RichText, WaveDivider } from "@/components/common";

/**
 * The creator's message — live section `5392376`, measured from its
 * stylesheets.
 *
 *   section    background #FFF8F8, padding 120px 0, z-index 55
 *              bounded top AND bottom by the "mountains" wave divider (80px)
 *   heading    30px/38px, weight 800, brand red, centred  ·  28px/40px ≤767
 *   spacer     26px below the heading
 *   portrait   112x112, circular
 *   quote      18px/27px, centred, max-width 80%  ·  100% ≤600
 *              THE ONE PLACE THE SITE PAINTS RUBIK — see `font-quote`
 *   name       16px/20px, weight 700, brand red
 *   role       14px/20px, weight 400, ink
 *
 * The whole column fades in (`_animation: fadeIn` on the live column).
 *
 * The three doodles are absolutely positioned against the CONTAINER, not the
 * viewport, with the live offsets — and each one MOVES, on a 5s loop that never
 * stops:
 *
 *   clef   36px wide, top 450px, right 430px           tumbles
 *   star   24px wide, bottom 80%, right 55px           drifts
 *          (right 0 ≤1024 — `desktop:`, not `lg:`, or it lands 55px out at
 *           exactly 1024; see deviation 16)
 *   note   36px wide, top 440px, left −110px           tumbles
 *
 * They are decorative, so each is `aria-hidden` and `pointer-events-none`
 * (which the live theme also sets), and they sit behind the copy.
 * `overflow-hidden` on the section keeps the note's negative offset from
 * widening the page on small screens.
 */

/**
 * The live offsets AND the live loop, in the order the CMS lists the
 * decorations.
 *
 * Each doodle carries one of the theme's two ambient classes, and they are not
 * interchangeable: the clef and the note are `gt3_rotated_element`, so they
 * tumble; the star is `gt3_moved_element`, so it only drifts. Both loops are
 * 5s linear and never stop.
 *
 * The animation rides on a wrapper INSIDE the positioned span, because both
 * keyframes animate `transform` — putting them on the positioned element itself
 * would fight its placement.
 */
const DECORATIONS = [
  { position: "top-[450px] right-[430px]", width: "w-9", motion: "animate-particle-tumble" },
  {
    /* The star is the only one anchored by a PERCENTAGE, so unlike the other
     * two it is sensitive to the height of the box it is positioned against —
     * and ours is 20px taller than the live one (the live column adds a second
     * 10px gutter vertically that it does not add horizontally). 80% of that
     * 20px is the constant 4px measured at every breakpoint, so it is added
     * back here rather than by re-insetting the layer, which would move the
     * other two doodles off their exact `top` values. */
    position: "bottom-[calc(80%+4px)] right-0 desktop:right-[55px]",
    width: "w-6",
    motion: "animate-particle-drift",
  },
  { position: "top-[440px] -left-[110px]", width: "w-9", motion: "animate-particle-tumble" },
];

export function FounderMessage({ block }: { block: FounderMessageBlock }) {
  return (
    <section className="bg-blush-warm relative z-[55] overflow-hidden py-[120px]">
      <WaveDivider position="top" />
      <WaveDivider position="bottom" />

      {/* `p-5` is the live column gutter counted twice — the section's own
       * column and the inner section's each contribute 10px. Horizontally it is
       * what makes the content 1180 wide inside the boxed 1220, and therefore
       * what the quote's `max-w-[80%]` is 80% OF. */}
      <Container gutter="elementor">
        {/* This wrapper is what the doodles are positioned against, and it has
         * to exist: `absolute` resolves to the nearest positioned ancestor's
         * PADDING box, so anchoring to `Container` itself would ignore the
         * container's own responsive inset and put the layer 4–20px out,
         * depending on breakpoint. A plain child's border box IS the
         * container's content box. */}
        <div className="relative">
          {/* The doodles sit inside that box by a further 10px — Elementor's
           * column gutter. Their own layer, so the content's 20px `p-5` below
           * cannot shift them. */}
          <div aria-hidden className="pointer-events-none absolute inset-[10px] z-0">
            {block.decorations?.map((decoration, index) => (
              <span
                key={decoration.src}
                /* Visible at EVERY width, as on the live site. The note's
                 * negative left offset puts it off-screen below 1025px, where the
                 * section's `overflow-hidden` clips it — which is exactly what
                 * the live page does, so it is clipped rather than hidden.
                 *
                 * `p-[10px]` is the live widget's own padding: it makes the box
                 * 20px wider than its glyph and sits the glyph 10px in. */
                className={cn("absolute p-[10px]", DECORATIONS[index]?.position)}
              >
                {/* The width sits INSIDE the padding: `box-sizing: border-box`
                 * would otherwise take the 20px out of the glyph rather than
                 * adding to it, and the live box is glyph + 20. */}
                <span
                  className={cn("block", DECORATIONS[index]?.width, DECORATIONS[index]?.motion)}
                >
                  <Img
                    src={decoration.src}
                    alt=""
                    width={decoration.width}
                    height={decoration.height}
                    className="h-auto w-full"
                  />
                </span>
              </span>
            ))}
          </div>

          <div className="relative p-5">
            <Reveal animation="fade-in" className="relative z-[2]">
              <h2 className="text-primary mb-[6px] text-center text-[28px] leading-[40px] font-extrabold md:text-[30px] md:leading-[38px]">
                {block.heading}
              </h2>

              {/* The live spacer widget under the heading. */}
              <div aria-hidden className="h-[26px]" />

              {/* `pt-2` is the live testimonial widget's own 8px top inset. */}
              <figure className="m-0 pt-2 text-center">
                {block.portrait && (
                  /* `mb-[13px]` is the gap the live page RENDERS. It declares 6.4px,
                   * but its portrait is an inline image and the line box it sits in
                   * adds the rest — so the declared number alone lands 7px short. */
                  <Img
                    src={block.portrait.src}
                    alt={block.portrait.alt}
                    width={block.portrait.width}
                    height={block.portrait.height}
                    className="mr-[18px] mb-[13px] inline-block size-28 rounded-full object-cover"
                  />
                )}

                <blockquote className="font-quote text-foreground mx-auto mt-0 max-w-full text-center text-lg leading-[27px] md:max-w-[80%]">
                  <RichText runs={block.quote} />
                </blockquote>

                <figcaption className="mt-[30px]">
                  <span className="text-primary block text-base leading-5 font-bold">
                    {block.name}
                  </span>
                  <span className="text-foreground block text-sm leading-5">{block.role}</span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
