import type { FaqsBlock } from "@/types";
import { faqJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Container, GT3_CENTERED_BUTTON_ROW, Img } from "@/components/common";

/**
 * The FAQ list beside a photo — live inner section `93f179c`.
 *
 *   ground     `#FFF8F8` (`--blush-warm`), inherited on the live page from the
 *              section this inner section sits in. Declared here too; see below.
 *   padding    0 · `0 5px` ≤1024
 *   text col   50%, `margin-right: 30px` · 0 ≤1024 · full width with
 *              `padding: 45px 5px 0` ≤767
 *   heading    Roboto 40px/48px weight 900, brand red, CENTRED, 20px below
 *              · 18px ≤767, and the 20px becomes a 4px margin ≤1024
 *   spacer     20px under the heading
 *   question   Roboto 18px/40px weight 800, brand red · 14px/1.5em ≤767,
 *              where each also gains a 15px top margin
 *   answer     Roboto 18px, `--foreground` · 14px ≤767
 *   spacer     30px above the closing heading
 *   closing    Roboto 23px/48px weight 800, brand red, centred · 20px ≤767
 *   image col  50%, image 443×443, pulled up 20px and right 55px · 0 ≤1024
 *
 * The question weight is 800 and the closing heading's is too: their id-keyed
 * rules set only colour, family and size, and the weight comes from the base
 * `.elementor-widget-heading h2` rule (Poppins 800/30/40) that they never
 * override. Reading only the id rules would have made both regular.
 *
 * **The image and text swap below 768px** — the live inner section carries
 * `elementor-reverse-mobile`, so the photo sits *above* the questions once they
 * stack. Done with `order`, so the heading still comes first in the document.
 *
 * A plain list, NOT an accordion: every answer is open on the live page. The
 * shadcn `Accordion` this section used before the live markup arrived is gone.
 *
 * **This block and `testimonials` are one Elementor section on the live page**,
 * and this is that section's inner section. They are two blocks because editors
 * reorder and hide sections independently, so each owns its own ground —
 * PARITY deviation 20.
 *
 * The FAQPage JSON-LD is emitted from the same block that renders the answers,
 * so an editor who edits, adds or hides FAQs cannot leave the structured data
 * describing questions the page no longer shows.
 */

/**
 * The live copy carries its own `Q:` / `A:` prefixes, which belong on screen
 * but not in structured data — a crawler should read the question, not the
 * label. Stripped for the JSON-LD only.
 */
function withoutPrefix(text: string) {
  return text.replace(/^\s*[QA]:\s*/, "");
}

export function Faqs({ block }: { block: FaqsBlock }) {
  const mediaFirst = block.mediaSide === "left";

  return (
    <section id={block.anchorId ?? undefined} className="bg-blush-warm">
      <Container gutter={false} className="p-2.5 max-lg:px-[5px]">
        <div className="flex flex-col md:flex-row">
          {/* Two levels, as live has them: the COLUMN is 50% wide, and the
           * inner wrapper carries the 30px margin and the 10px column-gap
           * padding. Collapsing them into one element gets the geometry wrong
           * twice over — `pr-[30px]` would override `p-2.5`'s right padding
           * instead of adding to it, and a margin on a `w-1/2` flex item
           * makes the pair overflow and shrink. Either way the column ends up
           * ~10px too wide and its centred button drifts off. */}
          <div className={cn("w-full max-md:order-2 md:w-1/2", mediaFirst && "md:order-2")}>
            <div
              className={cn(
                "p-2.5 max-md:px-[5px] max-md:pt-[45px]",
                mediaFirst ? "md:ml-[30px]" : "md:mr-[30px]",
              )}
            >
              <h2 className="font-body text-primary pb-5 text-center text-[18px] leading-12 font-black max-lg:pb-1 max-md:leading-[1.5em] md:text-[40px]">
                {block.heading}
              </h2>

              {/* The live 20px spacer widget under the heading. */}
              <div aria-hidden className="h-5" />

              {/* `dl`, not three more `h2`s: the live section emits an `h2` per
               * question, which would put five same-level headings on the page
               * and say nothing true about its outline. A description list is
               * what this content is, and it renders identically. */}
              <dl>
                {block.items.map((faq) => (
                  <div key={faq.question}>
                    <dt className="font-body text-primary text-[14px] leading-[1.5em] font-extrabold max-md:mt-[15px] md:text-[18px] md:leading-10">
                      {faq.question}
                    </dt>
                    <dd className="font-body text-foreground text-[14px] md:text-[18px]">
                      {faq.answer}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* The live 30px spacer widget. */}
              <div aria-hidden className="h-[30px]" />

              {block.closingHeading ? (
                <p className="font-body text-primary text-center text-[20px] leading-12 font-extrabold md:text-[23px]">
                  {block.closingHeading}
                </p>
              ) : null}

              {block.cta ? (
                <div className={GT3_CENTERED_BUTTON_ROW}>
                  <Button asChild variant="wipe" size="cta">
                    <a href={block.cta.href}>{block.cta.label}</a>
                  </Button>
                </div>
              ) : null}
            </div>
          </div>

          {block.image ? (
            <div className={cn("w-full max-md:order-1 md:w-1/2", mediaFirst && "md:order-1")}>
              <div className="p-2.5 max-md:px-[5px]">
                {/* The live widget is pulled up 20px and right 55px, letting the
                 * photo break out of its column — reproduced as measured, and
                 * dropped below 1025px where the live rule zeroes it. */}
                <div className="text-center lg:-mt-5 lg:-mr-[55px]">
                  <Img
                    src={block.image.src}
                    alt={block.image.alt}
                    width={block.image.width}
                    height={block.image.height}
                    className="inline-block h-auto max-w-full"
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </Container>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqJsonLd(
              block.items.map((faq) => ({
                question: withoutPrefix(faq.question),
                answer: withoutPrefix(faq.answer),
              })),
            ),
          ),
        }}
      />
    </section>
  );
}
