import type { PitchRowsBlock } from "@/types";
import { cn } from "@/lib/utils";
import { Container, Img, Reveal, RichText } from "@/components/common";

/**
 * The three outlined pitch rows — live section `103790ba`, measured from its
 * stylesheets.
 *
 *   section     no background of its own
 *               padding-top 100px  ·  80px ≤1024  ·  60px ≤767
 *               padding-bottom 60px at every width
 *   column      10px gutter all round, inside the boxed 1220
 *   row outline 2px solid #D9E2E9, radius 40px, on the row's widget-wrap
 *   row padding 36px 70px 36px 0  ·  15px 15px 15px 0 ≤1024  ·  0 15px 30px ≤767
 *   note        figure, max-width 136px, margin 15px 35px 15px 44px
 *   copy        16px/27px
 *   stagger     odd rows inset 9% left and 2% right; even rows 11% right
 *               (percentages of the COLUMN, 1200 at 1220 — not the container;
 *                all inset dropped ≤767, where the row centres instead)
 *   gaps        50px below each row, 20px below the last
 *
 * The stagger and the animations both come from the row's POSITION, not from
 * its content: rows 1 and 3 rotate in from the bottom-left and are inset on the
 * right, row 2 fades up and is inset on the left. An editor adding a fourth row
 * gets the pattern continued rather than an unstyled row, and the CMS never has
 * to carry a layout field.
 */
export function PitchRows({ block }: { block: PitchRowsBlock }) {
  return (
    <section className="desktop:pt-[100px] relative z-[1] pt-[60px] pb-[60px] md:pt-20">
      <Container gutter="elementor">
        {/* Elementor's 10px column gutter. Separate from the container's own
         * inset because the row insets below are percentages of THIS box. */}
        <div className="p-[10px]">
          {block.rows.map((row, index) => {
            const insetLeft = index % 2 === 1;
            const isLast = index === block.rows.length - 1;

            return (
              <Reveal
                key={index}
                slow
                animation={insetLeft ? "fade-in-up" : "rotate-in-up-right"}
                delayMs={insetLeft ? 10 : 5}
                className={cn(
                  isLast ? "mb-5" : "mb-[50px]",
                  insetLeft ? "md:pr-[2%] md:pl-[9%]" : "md:pr-[11%]",
                )}
              >
                <div className="border-pitch-border desktop:py-9 desktop:pr-[70px] desktop:pl-0 block rounded-[40px] border-2 px-[15px] pt-0 pb-[30px] text-center md:flex md:items-center md:py-[15px] md:pr-[15px] md:pl-0 md:text-left">
                  {block.bullet && (
                    /* The live figure declares `width:136px` but is a flex item
                     * that SHRINKS, landing at 98px / 107px / 110px across the
                     * tablet and desktop steps. Those outcomes are stated here
                     * rather than replaying Elementor's shrink arithmetic —
                     * logged in docs/PARITY.md.
                     *
                     * `h-[42px]` for a 34px glyph is not padding: the live image
                     * is INLINE and sits on a baseline, so its line box adds the
                     * descender gap. That 8px is most of row one's height,
                     * because row one is a single line of copy. */
                    /* `mt-[45px]` at mobile is two live margins stacked: the
                     * imagebox wrapper's own 30px top and the figure's 15px. */
                    <figure className="desktop:w-[110px] mt-[45px] mr-[35px] mb-[15px] ml-[44px] inline-block w-[136px] max-w-[136px] shrink-0 md:mt-[15px] md:block md:h-[42px] md:w-[98px] lg:w-[107px]">
                      <Img
                        src={block.bullet.src}
                        alt={block.bullet.alt}
                        width={block.bullet.width}
                        height={block.bullet.height}
                        aria-hidden={block.bullet.alt === "" || undefined}
                        className="mx-auto h-[34px] w-[19px] md:mx-0"
                      />
                    </figure>
                  )}

                  <p className="text-foreground min-w-0 flex-1 text-base leading-[27px]">
                    <RichText runs={row.body} />
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
