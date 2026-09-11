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
      <Container gutter={false} className="p-2.5">
        {/* The live 64px spacer widget. A padding rather than an empty div —
         * same result, one less element. */}
        <div className="pt-12.5 md:pt-16" />

        {/* `pb-10` is the live 20px heading padding PLUS Elementor's 20px
         * default widget margin. This column, unlike the FAQ one, never
         * zeroes that margin (`2cdbad7` does; `72e008f` does not), so every
         * widget here carries it — which is why reading only the heading's
         * own `padding: 0 0 20px 0` leaves this gap 20px short. */}
        <h2
          id={block.anchorId ?? undefined}
          className="font-body text-primary pb-10 text-center text-[18px] leading-12 font-black max-lg:pb-6 md:text-[40px]"
        >
          {block.heading}
        </h2>

        {block.items.map((testimonial) => (
          <div key={testimonial.author} className="font-body text-primary text-center">
            {/* Same 20px widget margin as the heading. */}
            <p className="mb-5 text-[14px] font-medium italic md:text-[18px]">
              <RichText runs={testimonial.quote} />
            </p>

            <p className="text-[14px] font-medium italic md:text-[18px]">{testimonial.author}</p>

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
          // 17px from the copy's last line box, measured. On the live page this
          // is the location widget's own bottom margin.
          <div className={cn("mt-[17px]", GT3_CENTERED_BUTTON_ROW)}>
            {/* `max-md:text-xs` is per-instance on purpose, not a change to the
             * shared `cta` size. All six gt3 buttons on the live page are a
             * 14px label; this is the ONLY one with a `≤767 → 12px` step, so
             * moving it into the variant would shrink the other five. */}
            <Button asChild variant="wipe" size="cta" className="max-md:text-xs">
              <a href={block.cta.href}>{block.cta.label}</a>
            </Button>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
