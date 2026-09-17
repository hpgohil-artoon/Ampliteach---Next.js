import type { TestimonialsBlock } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Container, GT3_CENTERED_BUTTON_ROW, RichText } from "@/components/common";

/**
 * The teacher quote — live section `559da34`, the part above its inner section.
 *
 *   ground    `#FFF8F8` (`--blush-warm`), boxed 1220px
 *   spacer    64px above the heading · 50px ≤767
 *   heading   Roboto 40px/48px weight 900, brand red, centred, 20px below
 *             · 18px ≤767, and the 20px becomes a 4px margin ≤1024
 *   quote     Roboto 18px weight 500 ITALIC, brand red, centred · 14px ≤767
 *   author    the same 18px italic treatment as the quote
 *   location  Roboto 15px, brand red, centred, pulled UP 20px
 *   button    the shared gt3 button, centred
 *
 * `Section` is not used: the live rhythm here is a 64px spacer widget above the
 * heading and nothing below, not the site's symmetric `py`.
 *
 * **This block and `faqs` are one Elementor section on the live page**, sharing
 * the `#FFF8F8` ground and this section's container. They are two blocks here
 * because editors reorder and hide sections independently, so each has to own
 * its own ground — PARITY deviation 20. The seam is invisible while they sit in
 * the live order, which is the point.
 */
export function Testimonials({ block }: { block: TestimonialsBlock }) {
  return (
    <section className="bg-blush-warm max-md:py-0">
      {/* `pb-0`: this block ends exactly where the FAQ inner section begins on
       * the live page, 419.81px below the section top. The 10px the live
       * widget-wrap pads at the BOTTOM belongs to the FAQ block, which is the
       * last of the pair — it carries it, so the seam adds up to the live
       * section's 999.44px rather than double-counting 10px here. */}
      {/* Container = Elementor's responsive inset; inner box = the column's own
       * 10px gutter. The two stack on the live site. */}
      <Container gutter="elementor">
        {/* `px-0` below 768: the live column's widget-wrap keeps its 10px gap
         * from 768 up and drops it entirely on mobile, where this heading runs
         * the full 440px of the container. */}
        <div className="px-0 pt-2.5 pb-0 md:px-2.5">
          {/* The live 64px spacer widget. A padding rather than an empty div —
           * same result, one less element. */}
          {/* 64px from 768 up, 50px below — except at the narrowest step, where
           * the live spacer is 40px. Measured at 480. */}
          <div className="pt-12.5 max-md:pt-10 md:pt-16" />

          {/* `pb-10` is the live 20px heading padding PLUS Elementor's 20px
           * default widget margin. This column, unlike the FAQ one, never
           * zeroes that margin (`2cdbad7` does; `72e008f` does not), so every
           * widget here carries it — which is why reading only the heading's
           * own `padding: 0 0 20px 0` leaves this gap 20px short. */}
          <h2
            id={block.anchorId ?? undefined}
            /* `max-desktop:pb-11` (44px), not the 24px the header note implies.
             * The live heading widget contributes 20px of padding and a 4px
             * margin, and the QUOTE widget below it adds a further 20px of its
             * own at ≤1024 — measured identically at 1024 and 480. Reading only
             * the heading's own two values left the quote 20px high. */
            className="font-body text-primary max-desktop:pb-11 pb-10 text-center text-[18px] leading-12 font-black md:text-[40px]"
          >
            {block.heading}
          </h2>

          {block.items.map((testimonial) => (
            <div key={testimonial.author} className="font-body text-primary text-center">
              {/* Same 20px widget margin as the heading. */}
              <p className="mb-5 text-[14px] font-medium italic md:text-[18px]">
                <RichText runs={testimonial.quote} />
              </p>

              {/* `max-md:leading-[30px]`: the live author widget's box is 30px
               * tall at 480, where the inherited 1.6875 ratio on 14px gives
               * only 23.6 — which put the location 7px high under it. */}
              <p className="text-[14px] font-medium italic max-md:leading-[30px] md:text-[18px]">
                {testimonial.author}
              </p>

              {/* NO pull, despite the live widget's `margin-top: -20px`. That
               * -20px exists only to cancel the author widget's +20px margin,
               * which our reset never adds — applying it here on top of a zero
               * margin printed the location straight through "Dylan R.". With
               * both omitted the 13px the live pair measures falls out of the
               * two line boxes on its own. */}
              {testimonial.location ? <p className="text-[15px]">{testimonial.location}</p> : null}
            </div>
          ))}

          {block.cta ? (
            /* 20px above and 40px below, and both are the live page's.
             *
             * Above: the location widget's own 20px bottom margin. It reads as
             * 17px if you measure from the last line box, because the live
             * location widget's inner container is pulled up 20px — which makes
             * its OUTER box only 5.31px tall while its text renders 20px higher.
             * The text lands in the same place either way; the flow does not.
             *
             * Below: the live button block is 51px tall (the 31px button plus
             * 20px) and then carries a further 20px margin, and the live section
             * ends immediately after it. Written as 40px of padding rather than
             * 20 + a 20px margin: with `pb-0` on the container above, a trailing
             * margin would collapse straight out through the section and take
             * the seam with it. */
            /* `max-md:pb-5` — below 768 the live button block keeps only 20px
             * under it, not the desktop 40. */
            <div className={cn("mt-5 pb-10 max-md:pb-5", GT3_CENTERED_BUTTON_ROW)}>
              {/* `max-md:text-xs` is per-instance on purpose, not a change to the
               * shared `cta` size. All six gt3 buttons on the live page are a
               * 14px label; this is the ONLY one with a `≤767 → 12px` step, so
               * moving it into the variant would shrink the other five. */}
              {/* `max-md:h-7` goes with the 12px label: the live control is 28px
               * tall here at 480, where the page's other five gt3 buttons stay
               * 31. Per-instance for the same reason the type size is. */}
              <Button asChild variant="wipe" size="cta" className="max-md:h-7 max-md:text-xs">
                <a href={block.cta.href}>{block.cta.label}</a>
              </Button>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
