import type { BenefitMediaBlock } from "@/types";
import { BULLET, Container, Img, Reveal } from "@/components/common";

/**
 * Student Benefits — live sections `7eebc1a` (the heading band) and `76c55aa`
 * (the content). Two Elementor sections sharing one `#FFF7F8` ground, so they
 * read as a single band and are built as one block.
 *
 *   band       `#FFF7F8`, boxed 1220px
 *   heading    Roboto 40px/48px weight 900, brand red, centred, in a 20px band
 *              · 18px/40px ≤767
 *   content    `padding: 20px` · `0 0 40px` ≤1024 · `0 0 60px` ≤767
 *   text col   60% · full width ≤1024, with `padding: 0 15px` · 0 ≤767
 *   — inner    `padding-right: 20px` · `30px 0 40px` ≤1024 · `60px 0 0` ≤767
 *   — list     18px/28px, `padding-left: 10px`, disc + the theme's red dot
 *              · 13.5px ≤767
 *   image col  40% · full width ≤1024
 *   — image    `width: 60%`, centred · 90% ≤767
 *
 * **The columns swap below 1025px.** The live section carries
 * `elementor-reverse-tablet` and `elementor-reverse-mobile`, so the guitar sits
 * ABOVE the list once they stack — hence `order` rather than plain source
 * order.
 *
 * Three entrance animations, all through the shared `Reveal`: the list slides
 * in from the left, the image column from the right, and the image itself
 * zooms in over 2s (`animated-slow`) with the live 5ms delay.
 */
export function BenefitMedia({ block }: { block: BenefitMediaBlock }) {
  return (
    /* `lg:px-5` sits on the SECTION, not on the containers. Both live sections
     * declare `padding: 20px`, and in Elementor that padding belongs to the
     * full-bleed section — the 1220px container is centred inside what is left
     * of 1920 and stays a full 1220 wide. Putting the same 20px on the
     * container instead shrank the box to 1180, which took 24px off the text
     * column and 16px off the image column; the image is `width: 60%` of its
     * column, so it rendered 283.2px instead of the live 292.8px and the whole
     * band came out 9.61px short. Horizontal only, and only at `lg`: the live
     * padding drops to `0 0 40px` below 1025px. */
    <section className="bg-blush-deep lg:px-5">
      {/* The heading band — its own live section, same ground. */}
      <Container gutter={false} className="py-5">
        <Reveal animation="slide-in-left">
          <h2
            id={block.anchorId ?? undefined}
            className="font-body text-primary text-center text-[18px] leading-[40px] font-black md:text-[40px] md:leading-[48px]"
          >
            {block.heading}
          </h2>
        </Reveal>
      </Container>

      <Container
        gutter={false}
        className="flex flex-col items-center px-0 pb-[60px] md:pb-10 lg:flex-row lg:py-5"
      >
        {/* `order-2` keeps the list BELOW the image while stacked, which is
         * what `elementor-reverse-tablet/mobile` does on the live site. */}
        <div className="order-2 w-full px-0 md:px-[15px] lg:order-1 lg:w-3/5 lg:px-0">
          {/* `lg:pt-[18px] lg:pb-[28px]` is the live box around this list, and
           * it matters because the column is vertically CENTRED against the
           * image: live pads the widget-wrap 10px and the `ul` itself carries
           * `margin: 8px 0 18px`, so the column's content is 242px tall, not
           * the list's own 196px. Centred in the 292.8px row that puts the
           * list at +43.39; with `lg:py-0` the 196px centred at +48.4 and
           * every bullet sat 5px low. 18 = 10 + 8, 28 = 10 + 18.
           *
           * The 10/30 horizontal insets are the same box: 20px of inner-section
           * right padding plus 10px of widget-wrap padding either side, which
           * makes the live list 692px wide inside a 732px column. At the 712px
           * a bare `lg:pr-5` gave, three of the four bullets broke onto their
           * second line a word later than the live ones. */}
          <div className="pt-[60px] md:pt-[30px] md:pb-10 lg:pt-[18px] lg:pr-[30px] lg:pb-[28px] lg:pl-2.5">
            <Reveal animation="slide-in-left">
              <ul className="font-body list-none pl-[10px] text-[13.5px] leading-[28px] md:text-[18px]">
                {block.items.map((item) => (
                  <li key={item} className={BULLET}>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        {block.image ? (
          <Reveal
            animation="slide-in-right"
            className="order-1 w-full text-center lg:order-2 lg:w-2/5"
          >
            <Reveal animation="zoom-in" slow delayMs={5}>
              <Img
                src={block.image.src}
                alt={block.image.alt}
                width={block.image.width}
                height={block.image.height}
                className="mx-auto h-auto w-[90%] md:w-3/5"
              />
            </Reveal>
          </Reveal>
        ) : null}
      </Container>
    </section>
  );
}
