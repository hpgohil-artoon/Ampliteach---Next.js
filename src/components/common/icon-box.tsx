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
 *   bullets   `list-style: disc`, 18px · 15px ≤1024 · 13.5px ≤767, on a fixed
 *             27px line box. The 18px is MEASURED off a browser screenshot,
 *             not derived: the live CSS sets 15px and 13.5px for the two
 *             smaller steps but nothing for desktop, which reads as "inherit
 *             16px from `body`" — yet the same bullet string measures 328px on
 *             the live site against 288px at 16px, a ratio of 1.14.
 *   indent    80px · 40px ≤1024 · 30px ≤767 — the 80px is the icon's own width
 *             plus its margin, so the list aligns under the text
 *   widget    10px of bottom padding
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
    <div className="font-body pb-[10px] text-left md:flex md:items-start">
      {Icon ? (
        <span
          aria-hidden
          className="text-primary border-primary mx-auto mb-[10px] flex size-[85px] shrink-0 items-center justify-center rounded-[15px] border-8 border-double md:mx-0 md:mr-[30px]"
        >
          <Icon className="h-[50px] w-auto" />
        </span>
      ) : null}

      {/* `pb-[18px]` stands in for a quirk of the live markup: every icon-box
       * ends with an empty `<p></p>` after its list, and the theme's
       * `p { margin: 0 0 18px }` makes that empty element 18px of real
       * vertical space in every card. Reproduced as padding, which is
       * identical here — the content column is a flex item, so the margin
       * could not have collapsed out of it either. */}
      <div className="grow">
        <h3 className="text-primary mb-[5px] text-[26px] leading-[30px] font-black">{title}</h3>

        <p className="text-[13.5px] leading-[1.6875] md:text-[18px]">
          <RichText runs={description} />
        </p>

        {/* The list inherits the card's `font-body`, like the description.
         * A headless capture of the live page renders these bullets in a serif
         * face, which is an artefact of that environment rather than the truth:
         * no webfont loads there. In a real browser the live bullets are the
         * same sans as the copy above them. Headless is not a reliable witness
         * for font-family — see "How these values were measured". */}
        {bullets?.length ? (
          <ul className="list-none pl-[30px] text-[13.5px] leading-[27px] md:pl-[40px] md:text-[15px] lg:pl-[80px] lg:text-[18px]">
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
