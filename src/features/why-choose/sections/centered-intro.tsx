import type { CenteredIntroBlock } from "@/types";
import { Container, Reveal, RichText } from "@/components/common";

/**
 * A centred heading, subheading and paragraph — live sections `68df698` and
 * `b0296ad`, measured from their stylesheets.
 *
 *   heading band  padding-top 60px  ·  80px ≤767, no bottom padding
 *                 boxed 1220, 10px column gutter
 *   heading       40px/48px, weight 800, brand red  ·  28px/40px ≤767
 *   body band     padding 0 15px 60px, boxed 1220, 10px column gutter
 *   subheading    h3 — 24px/30px, weight 800, INK (not red)
 *   paragraph     16px/27px
 *
 * Two live sections rather than one because each animates separately: the
 * heading comes in from the right and the body from the left. They always
 * appear together and read as a single unit, so they are one block here — the
 * same call `closing-statement` makes on the home page.
 *
 * The two DO differ in one measurable way, so the merge does not flatten it:
 * the heading band has no horizontal padding while the body band has 15px, and
 * below 1220 that makes the heading's box 30px wider than the body's. Each half
 * therefore keeps its own wrapper rather than sharing one container.
 *
 * The heading is 40px, the size the live theme gives an `h1`, while rendering
 * as an `h2`. That is the live page's own choice: its only `h1` is the red
 * banner's title, so this cannot also be one.
 */
export function CenteredIntro({ block }: { block: CenteredIntroBlock }) {
  return (
    <section className="relative z-[1] pt-20 pb-[60px] md:pt-[60px]">
      <Container gutter="elementor">
        {/* The heading band's column gutter, measured: `0 5px` at mobile, 10px
         * from 768 up — plus 4px more below on tablet, where the live heading
         * widget carries an extra bottom margin. */}
        <div className="desktop:pb-[10px] px-[5px] py-[2px] md:p-[10px] md:pb-[14px]">
          <Reveal animation="fade-in-right">
            <h2 className="text-primary text-center text-[28px] leading-[40px] font-extrabold md:text-[40px] md:leading-[48px]">
              {block.heading}
            </h2>
          </Reveal>
        </div>
      </Container>

      {/* The live body band's own padding — the one thing that separates it
       * from the heading band above. 15px from 600 up; below that the
       * container's own 20px inset takes over. */}
      <div className="px-5 sm:px-[15px]">
        <Container gutter={false}>
          <div className="p-[10px]">
            <Reveal animation="fade-in-left">
              {block.subheading && (
                <h3 className="text-foreground text-center text-2xl leading-[30px] font-extrabold">
                  {block.subheading}
                </h3>
              )}

              {/* The live widget puts a `<br>` between the h3 and the copy; the
               * 27px line-height of that empty line is what this reproduces. */}
              <p className="text-foreground mt-[27px] text-center text-base leading-[27px]">
                <RichText runs={block.body} />
              </p>
            </Reveal>
          </div>
        </Container>
      </div>
    </section>
  );
}
