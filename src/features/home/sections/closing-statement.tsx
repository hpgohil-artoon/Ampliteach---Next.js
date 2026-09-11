import type { ClosingStatementBlock } from "@/types";
import { cn } from "@/lib/utils";
import { Container, RichText } from "@/components/common";

/**
 * The page's sign-off — live sections `92421d6` (the red strip) and `b7134d7`
 * (the statement), measured from their stylesheets and a browser screenshot.
 *
 *   strip       `#FF1616`, boxed 1220px, `padding: 10px 0`
 *   — text      Roboto 18px, white, centred, line-height 1.6875 from the
 *               theme's bare `p` rule — the widget declares none
 *   statement   `margin-top: 20px`, boxed 1220px
 *   — text      Roboto 30px/1.3em weight 600, brand red, centred · 19px ≤767
 *   — spacing   18px between the two paragraphs
 *
 * Both bands' inner 10px comes from Elementor's default column gap.
 *
 * `Section` is not used: the live rhythm here is a flat 10px strip and a 20px
 * margin, neither of which follows the site's vertical scale.
 *
 * The statement's second band declares `bg-background` although the live
 * section declares no background at all. That is the standing rule that every
 * block owns its own ground (PARITY deviation 20), so this one renders
 * correctly if an editor ever puts it against a coloured section.
 *
 * **A third live section is deliberately missing.** `5a93287` sits between
 * these two and holds a "Footer Links:" bullet list, but it carries
 * `elementor-hidden-desktop elementor-hidden-tablet elementor-hidden-phone` —
 * hidden at every breakpoint, so it renders for nobody. It is not reproduced;
 * the same four links are in the footer. See PARITY.
 */
export function ClosingStatement({ block }: { block: ClosingStatementBlock }) {
  return (
    <>
      <section className="bg-primary py-2.5">
        <Container gutter={false} className="p-2.5">
          <p className="font-body text-primary-foreground text-center text-[18px] leading-[1.6875]">
            {block.intro}
          </p>
        </Container>
      </section>

      {/* `mt-5` is the live section's own `margin-top: 20px`. */}
      <section className="bg-background mt-5">
        <Container gutter={false} className="p-2.5">
          {block.statement.map((paragraph, index) => (
            <p
              key={index}
              // 18px between paragraphs, from the theme's `p` margin. Carried
              // as a top margin on the later ones rather than a bottom margin
              // on all, because Elementor zeroes the last paragraph's margin
              // in a text widget — so a bottom margin would add 18px of dead
              // space under the section that the live page does not have.
              className={cn(
                "font-body text-primary text-center text-[19px] leading-[1.3] font-semibold md:text-[30px]",
                index > 0 && "mt-[18px]",
              )}
            >
              <RichText runs={paragraph} />
            </p>
          ))}
        </Container>
      </section>
    </>
  );
}
