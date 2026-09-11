import type { TrialCtaBlock } from "@/types";
import { TrialSignupForm } from "@/components/forms";
import { Container, RichText } from "@/components/common";

/**
 * The free-trial band — live section `e112963`, measured from its stylesheets
 * and a browser screenshot.
 *
 *   section   brand red `#FF1616`, boxed 1220px, `padding: 20px`
 *   heading   white, Roboto 30px/40px weight 900, centred
 *             · 18px/1.4em and left-aligned ≤767
 *   copy      white, Roboto 18px on a 1.6875 line-height, vertically centred
 *             against the form · 13.5px, left ≤767
 *   privacy   white, Roboto 18px weight 600 ITALIC, centred, full width
 *             · 11px, left ≤767
 *
 * `anchorId` is content, not decoration: the live hero and the feature grid's
 * three buttons all link to `#power_of_ampliteach`, and that URL may be linked
 * from outside the site, so the id travels with the block.
 *
 * `Section` is not used — the live padding is a flat 20px, not the site rhythm.
 */
export function TrialCta({ block }: { block: TrialCtaBlock }) {
  return (
    <section id={block.anchorId} className="bg-primary p-5">
      {/* TWO nested 10px paddings, both Elementor's default column gap: the
       * outer column takes the 1220px box to 1200, its two halves are 600
       * each, and their own 10px leaves 580 of content — which is exactly
       * what the live form column measures, and what makes each field in a
       * two-up row 270px. Drop either one and every input is 5–10px wide. */}
      <Container gutter={false} className="p-2.5">
        {/* `mb-5` is the live heading widget's own 20px margin, plainly. It was
         * 31px to make the label ink land 117px into the band — a figure that
         * only needed 11px of help because the form below was 30px short of the
         * live 495px. With the form right, the live margin is right. */}
        <h2 className="font-body text-primary-foreground mb-5 text-center text-[18px] leading-[1.4] font-black md:text-[30px] md:leading-10">
          {block.heading}
        </h2>

        <div className="flex flex-col md:flex-row md:items-center">
          <div className="font-body text-primary-foreground w-full p-2.5 text-[13.5px] leading-[1.6875] md:w-1/2 md:text-[18px]">
            {/* Groups, not a flat list: 12px between them, 18px between the
             * paragraphs inside one. See TrialCtaBlock for why. */}
            {block.body.map((group, groupIndex) => (
              <div key={groupIndex} className={groupIndex > 0 ? "mt-3" : undefined}>
                {group.map((paragraph, paragraphIndex) => (
                  <p key={paragraphIndex} className={paragraphIndex > 0 ? "mt-4.5" : undefined}>
                    <RichText runs={paragraph} />
                  </p>
                ))}
              </div>
            ))}
          </div>

          <div className="w-full p-2.5 md:w-1/2">
            <TrialSignupForm />
          </div>
        </div>

        {/* No top margin. The live note sits immediately under the two-column
         * row — 585px in, which is the 70px above the row plus the row's own
         * 515px — and the band then closes on its measured 625.38px of content.
         * The 9px this used to carry was the other half of the short form. */}
        <p className="font-body text-primary-foreground text-left text-[11px] font-semibold italic md:text-center md:text-[18px]">
          {block.privacyNote}
        </p>
      </Container>
    </section>
  );
}
