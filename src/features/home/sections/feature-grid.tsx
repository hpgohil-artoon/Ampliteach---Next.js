import Link from "next/link";
import type { FeatureGridBlock } from "@/types";
import { Button } from "@/components/ui/button";
import { Container, IconBox } from "@/components/common";

/**
 * "Features That Drive Success" — live section `59e9439` (`features_titel_mian`).
 *
 *   section    `#FFFAFB` ground, boxed 1220px, `padding: 30px 0` · `30px 0 20px` ≤767
 *   heading    Roboto 40px/48px weight 900, brand red, centred
 *              28px ≤1024 · 24px and capped at 260px ≤599
 *   rows       two columns, each cell padded 10px, rows 10px apart
 *   CTA        after every fourth feature — three of them on the live page
 *
 * The red bracket is the column's `::before`: an absolutely positioned box with
 * only its left, top and bottom borders drawn and the left corners rounded, so
 * it reads as a `[` around the grid. The heading sits on its top edge with the
 * section's own background behind it, knocking a notch out of the rule — the
 * same trick as a `<fieldset>` legend.
 *
 * Its seven breakpoints are the live site's own and do not line up with the
 * project's tokens: 1280, 1200, 1024, 991, 767, 599 and 430. Written as
 * arbitrary `max-[…]` variants rather than rounded to the nearest token,
 * because rounding would move the bracket relative to the content it frames.
 *
 * `Section` is not used: the live padding is a flat 30px, not the site rhythm.
 */
export function FeatureGrid({ block }: { block: FeatureGridBlock }) {
  const Heading = block.headingLevel ?? "h2";
  const step = block.ctaAfterEvery ?? block.features.length;

  // Features in chunks, with a CTA after each chunk — the live grid repeats its
  // button every four features rather than once at the end.
  const chunks: FeatureGridBlock["features"][] = [];
  for (let i = 0; i < block.features.length; i += step) {
    chunks.push(block.features.slice(i, i + step));
  }

  return (
    <section id={block.anchorId ?? undefined} className="bg-blush pt-[30px] pb-5 md:pb-[30px]">
      {/* Flush, like every Elementor content section: the 1220px box has no
       * gutter of its own and the inset comes from each cell's 10px padding. */}
      <Container gutter={false}>
        <div className="before:border-primary relative before:absolute before:top-[22px] before:bottom-[34px] before:left-[-2%] before:w-[39%] before:rounded-l-[60px] before:border-y-2 before:border-l-2 before:content-[''] max-[1280px]:before:left-[2px] max-[1200px]:before:w-[33%] max-[1200px]:before:rounded-l-[40px] max-[991px]:before:w-[27%] max-[991px]:before:rounded-l-[20px] max-[767px]:before:h-[99.2%] max-[767px]:before:w-[20%] max-[767px]:before:rounded-l-[10px] max-[599px]:before:left-0 max-[599px]:before:h-[99.3%] max-[599px]:before:w-[13%] max-[430px]:before:top-[23px] max-[430px]:before:h-[99.4%] max-[430px]:before:w-[15%]">
          <div className="relative z-[5] text-center">
            {/* `inline-block` on the section's own ground is what notches the
             * bracket's top border where the title crosses it. */}
            <Heading className="font-body bg-blush text-primary inline-block px-[10px] text-[24px] leading-[1.4] font-black max-[599px]:max-w-[260px] sm:text-[28px] md:leading-[48px] lg:text-[40px]">
              {block.heading}
            </Heading>
          </div>

          {chunks.map((chunk, chunkIndex) => (
            <div key={chunkIndex}>
              <div className="my-[10px] md:grid md:grid-cols-2">
                {chunk.map((feature) => (
                  <div key={feature.title} className="p-[10px]">
                    <IconBox {...feature} />
                  </div>
                ))}
              </div>

              {block.cta ? (
                <div className="my-5 mr-[22px] text-center max-[767px]:m-0">
                  <Button asChild variant="wipe" size="cta">
                    <Link href={block.cta.href}>{block.cta.label}</Link>
                  </Button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
