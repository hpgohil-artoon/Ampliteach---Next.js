import type { RevealAnimation } from "@/components/common";
import type { TintedCard, TintedCardsBlock } from "@/types";
import { cn } from "@/lib/utils";
import { Img, Reveal, RichText } from "@/components/common";

/**
 * The closing three-up of tinted cards — live section `ee9cc70`, measured from
 * its stylesheets.
 *
 *   section    padding 0 15px 80px, columns vertically centred
 *   columns    three across from `lg`, stacked below
 *   column pad 10px  ·  50px 10px 10px below `lg` for every column but the first
 *   card       tinted ground, radius 10px
 *              padding 40px 23px  ·  64px 25px ≤1024  ·  25px 25px 40px ≤767
 *              min-height 460px from `lg` (the live 380px is on the card's
 *              CONTENT, inside its 40px padding — same box, stated once)
 *   icon       figure, max-width 140px, margin-bottom 24px, centred
 *   title      19px/26px, weight 700, uppercase, with a 100x4px brand-red
 *              underline (radius 20px) centred 15px below it
 *   body       14px/23.8px (1.7em), centred, padding-top 20px
 *   quotes     the italic lines inside a card sit on a 35px (2.5em) line
 *
 * Like the pitch rows, the per-card ANIMATION comes from position — left, up,
 * right — so a fourth card continues the pattern instead of arriving unstyled.
 * The tint does not: it is a named tone the editor picks, because the three
 * grounds are not a sequence.
 *
 * The live titles are stored in WordPress already upper-cased, and only the
 * first card also carries `text-transform: uppercase`. Here the copy is stored
 * in sentence case and all three are upper-cased in CSS: identical pixels, but
 * an editor sees readable copy and casing stays a presentation decision.
 *
 * `desktop:` is Elementor's real desktop step — see the note in
 * `media-intro.tsx` and the variant's definition in globals.css.
 */

const TONE_GROUND: Record<TintedCard["tone"], string> = {
  lilac: "bg-card-lilac",
  mint: "bg-card-mint",
  cream: "bg-card-cream",
};

/** The live order: the cards arrive from the left, then below, then the right. */
const ENTRANCE: RevealAnimation[] = ["fade-in-left", "fade-in-up", "fade-in-right"];

export function TintedCards({ block }: { block: TintedCardsBlock }) {
  return (
    <section className="relative z-[1] px-[15px] pb-20">
      {/* FULL WIDTH, not the site's boxed 1220 — the live section carries
       * `elementor-section-full_width`, so the three cards span the viewport
       * less its 15px side padding. Boxing this was what made our cards ~220px
       * narrower and therefore much taller than the live ones. */}
      <div className="desktop:grid-cols-3 grid w-full items-center gap-0">
        {block.cards.map((card, index) => (
          <Reveal
            key={card.title}
            animation={ENTRANCE[index % ENTRANCE.length]}
            className={cn("p-[10px]", index > 0 && "desktop:pt-[10px] pt-[50px]")}
          >
            <div
              className={cn(
                "desktop:min-h-[460px] desktop:px-[23px] desktop:py-10 h-full rounded-[10px] px-[25px] pt-[25px] pb-10 text-center md:px-[25px]",
                /* Positional again, and measured: on tablet the first card is
                 * padded 64px and the rest 57px, just as the first column is
                 * padded 10px on top and the rest 50px. */
                index === 0 ? "md:py-16" : "md:py-[57px]",
                TONE_GROUND[card.tone],
              )}
            >
              {card.icon && (
                /* `h-[42px]` for a 34px glyph: the live image is inline and its
                 * line box adds the descender gap — the same 8px as the pitch
                 * rows. It shows here on any card taller than the 460px floor. */
                /* `mt-[30px]` at mobile is the live imagebox wrapper's own top
                 * margin — the same one that offsets the pitch-row note. It
                 * pushes the card's whole content down, not just the icon. */
                <figure className="mx-auto mt-[30px] mb-6 h-[42px] w-full max-w-[140px] md:mt-0">
                  <Img
                    src={card.icon.src}
                    alt=""
                    width={card.icon.width}
                    height={card.icon.height}
                    aria-hidden
                    className="mx-auto h-[34px] w-[19px]"
                  />
                </figure>
              )}

              {/* The underline is the live `h5::after` — absolutely placed 15px
               * below the heading box, so it never moves when the title wraps
               * to two lines. */}
              <h5
                className={cn(
                  "text-foreground after:bg-brand relative text-[19px] leading-[26px] font-bold uppercase after:absolute after:-bottom-[15px] after:left-1/2 after:h-1 after:w-[100px] after:-translate-x-1/2 after:rounded-[20px] after:content-['']",
                  /* And again: 10px under the first card's title, 3px under the
                   * rest. It only moves the copy — the underline is positioned
                   * off the heading box, so it does not shift. */
                  index === 0 ? "mb-[10px]" : "mb-[3px]",
                )}
              >
                {card.title}
              </h5>

              {/* `[&_i]:leading-[35px]` is the live `.third_col_box span` rule:
               * the quoted lines sit on a 2.5em line while the rest of the
               * paragraph stays at 1.7em. */}
              <p className="text-foreground pt-5 text-sm leading-[23.8px] [&_i]:leading-[35px]">
                <RichText runs={card.body} />
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
