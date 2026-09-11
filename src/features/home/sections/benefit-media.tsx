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
    <section className="bg-blush-deep">
      {/* The heading band — its own live section, same ground. */}
      <Container gutter={false} className="p-5">
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
        className="flex flex-col items-center px-0 pb-[60px] md:pb-10 lg:flex-row lg:p-5"
      >
        {/* `order-2` keeps the list BELOW the image while stacked, which is
         * what `elementor-reverse-tablet/mobile` does on the live site. */}
        <div className="order-2 w-full px-0 md:px-[15px] lg:order-1 lg:w-3/5 lg:px-0">
          <div className="pt-[60px] md:pt-[30px] md:pb-10 lg:py-0 lg:pr-5">
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
