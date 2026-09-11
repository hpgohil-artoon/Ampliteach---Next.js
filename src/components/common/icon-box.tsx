import type { Feature } from "@/types";
import { ICONS } from "@/lib/icons";
import { BULLET } from "./bullet";
import { RichText } from "./rich-text";

/**
 * The live `elementor-widget-icon-box`, measured from ampliteach.com.
 *
 *   icon      50px glyph in an 85×85 box, 8px DOUBLE border, radius 15px, red
 *   layout    icon left of the content with tops aligned from 768px up; below
 *             that the wrapper is not flex, so the icon centres above instead
 *   gap       30px between icon and content · 10px ≤767
 *   title     Roboto 26px/900 on a 30px line box, brand red, 5px below
 *   body      Roboto 18px · 13.5px ≤767, `line-height: 1.6875`
 *   bullets   `list-style: disc`, **Poppins** 16px · 15px ≤1024 · 13.5px ≤767,
 *             on a fixed 27px line box. Unlike the title and description above
 *             them — which declare `Roboto, sans-serif` and paint Arial —
 *             these bullets declare no family of their own and inherit `body`'s
 *             Poppins, which the live site really does load. Hence `font-sans`
 *             here rather than the card's `font-body`. Confirmed in real
 *             Chrome: the live `li` declares `Poppins | 16px` and Chrome
 *             rasterises 44 glyphs of Poppins in it.
 *
 *             The 16px is the live value, not a guess: the live CSS sets 15px
 *             and 13.5px for the two smaller steps and nothing for desktop, so
 *             desktop inherits `body`'s 16px. This file previously had 18px
 *             `font-body`, which wrapped three of these bullets onto a second
 *             line that the live ones do not have.
 *   indent    80px · 40px ≤1024 · 30px ≤767 — the 80px is the icon's own width
 *             plus its margin, so the list aligns under the text
 *   widget    NO padding of its own — see the note on the wrapper below
 *
 * `border-double` is not licence: the live border really is
 * `border-style: double`, which paints two rules with a gap and reads visibly
 * lighter than a solid 8px one.
 *
 * The glyph is centred BOTH ways. The live rule is `display: flex;
 * align-items: center` with no `justify-content`, which on its face would sit
 * the glyph at flex-start — but the live site draws it centred, so this matches
 * what is rendered rather than what is declared.
 *
 * The glyph is sized by HEIGHT with `w-auto`. Font Awesome viewBoxes are
 * `0 0 W 512` — mostly not square — so forcing a 50×50 box would stretch them;
 * 512 units to 50px is exactly what `font-size: 50px` does to the webfont.
 */
export function IconBox({ title, description, bullets, icon }: Feature) {
  // A lookup in a module-level table, not a component built here: an unknown
  // name from the CMS drops the icon instead of breaking the card.
  const Icon = icon ? (ICONS[icon] ?? null) : null;

  return (
    // NO bottom padding. The live `.elementor-icon-box-wrapper` is exactly as
    // tall as its content (measured 180.13px for the Simplified Payroll card,
    // matched here to the hundredth), and the only 10px around it belongs to
    // the grid cell — `p-[10px]` in feature-grid, the live column's own
    // padding. A `pb-[10px]` here double-counted it and made every card row
    // 10px taller than the live one.
    <div className="font-body text-left md:flex md:items-start">
      {Icon ? (
        <span
          aria-hidden
          className="text-primary border-primary mx-auto mb-[10px] flex size-[85px] shrink-0 items-center justify-center rounded-[15px] border-8 border-double md:mx-0 md:mr-[30px]"
        >
          <Icon className="h-[50px] w-auto" />
        </span>
      ) : null}

      {/* No trailing spacer. The live markup does end each icon-box with an
       * empty `<p></p>` that the theme's `p { margin: 0 0 18px }` turns into
       * real space — but that margin is the LAST thing in the content column,
       * so it collapses through and adds nothing: the live content box measures
       * 180.13px for the Simplified Payroll card, which is its text and list
       * alone. This file used to carry an 18px padding for it. */}
      <div className="grow">
        <h3 className="text-primary mb-[5px] text-[26px] leading-[30px] font-black">{title}</h3>

        <p className="text-[13.5px] leading-[1.6875] md:text-[18px]">
          <RichText runs={description} />
        </p>

        {/* `font-sans` OVERRIDES the card's `font-body`, on purpose: the live
         * list widget declares no family, so it inherits `body`'s Poppins,
         * while the title and description above it declare `Roboto,
         * sans-serif` and paint Arial. So one card legitimately mixes two
         * faces. Verified in real Chrome — a headless capture shows these
         * bullets in a serif fallback and is not a witness for font-family. */}
        {bullets?.length ? (
          <ul className="list-none pl-[30px] font-sans text-[13.5px] leading-[27px] md:pl-[40px] md:text-[15px] lg:pl-[80px] lg:text-[16px]">
            {/* Two dots per item, and it is not a mistake: the live disc comes
             * from `list-style` and the theme's `.content-container ul >
             * li:before` adds a brand-red circle on top of it. Both are drawn
             * from one pseudo-element here — see ./bullet.ts for why. */}
            {bullets.map((runs, index) => (
              <li key={index} className={BULLET}>
                <RichText runs={runs} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
