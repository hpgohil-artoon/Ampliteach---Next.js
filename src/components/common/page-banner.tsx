import Link from "next/link";
import { Fragment } from "react";
import type { Breadcrumb } from "@/types";

/**
 * The red title band every inner page opens with.
 *
 * Measured from the live theme element (`.gt3-page-title`), which carries its
 * values as inline styles rather than in a stylesheet:
 *
 *   band        background #FF1616, colour #FFFFFF, `display: table`
 *               height 261px  ·  200px ≤600
 *   heading     h1 — 40px/48px, weight 800, centred
 *               28px/33.6px ≤480
 *   breadcrumbs 12.432px/27px, weight 400, centred, white
 *   delimiter   a dot between crumbs, drawn here rather than by a font icon
 *
 * The odd 12.432px is not a typo — it is what the live theme computes, and
 * rounding it to 12 or 13 is a visible difference at this weight.
 *
 * `display: table` is how the live theme centres the content vertically. A grid
 * with `place-items-center` produces the identical box at every width measured,
 * and does not need a table-cell child, so that is what is used.
 *
 * This is site chrome, not a why-choose section, so it lives in
 * `components/common` — every non-home page needs one.
 */
export function PageBanner({
  heading,
  breadcrumbs,
}: {
  heading: string;
  breadcrumbs: Breadcrumb[];
}) {
  return (
    <section className="bg-brand text-brand-foreground grid h-[200px] place-items-center md:h-[261px]">
      {/* The banner is THEME chrome, so it sits in the theme's `.container`,
       * not the 1220px Elementor box the page sections use — and that container
       * is STEPPED (1170 / 998 / 740 / 560 / 420 / 90%), not fluid. `Container`
       * deliberately smooths those steps away for page content; here the steps
       * are reproduced, because this band is the same on every inner page and
       * its width is what centres the title. Measured: 420 at 480px, 560 at
       * 600, 740 at 768, 998 at 1024, 1170 from 1200 up. */}
      <div className="xs:w-[420px] mx-auto w-[90%] sm:w-[560px] md:w-[740px] lg:w-[998px] xl:w-[1170px]">
        <h1 className="text-center text-[28px] leading-[33.6px] font-extrabold sm:text-[40px] sm:leading-[48px]">
          {heading}
        </h1>

        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mt-px">
            <ol className="flex flex-wrap items-center justify-center text-[12.432px] leading-[27px] font-normal">
              {breadcrumbs.map((crumb, index) => (
                <Fragment key={crumb.label}>
                  {index > 0 && (
                    /* The live delimiter is a DRAWN CIRCLE, not a character:
                     * an empty `<span>` whose `::after` is a 6px white disc with
                     * `margin: 0 10px` — 26px of total width. A `&bull;` glyph
                     * was noticeably smaller and sat on the text baseline
                     * instead of the middle. `bg-current` inherits the band's
                     * white, so the dot never needs its own colour. */
                    <li
                      aria-hidden
                      className="mx-[10px] size-[6px] shrink-0 rounded-full bg-current"
                    />
                  )}
                  {/* `tracking-[1px]` sits on the crumb TEXT, not on the list:
                   * the live delimiter between crumbs is `letter-spacing:
                   * normal` while the words either side are 1px. It is the only
                   * thing separating these from ordinary 12.432px/400 copy, and
                   * it is what makes the live trail read wider — "Home" is 43px
                   * against 39px unspaced. */}
                  {/* `px-px` is the live crumb's own `padding: 0 1px`. Measured
                   * with a Range, the text RUNS are already identical to the
                   * pixel (41.08px for "Home"); this padding is the whole of the
                   * remaining 2px per crumb, and it shifts the centred trail. */}
                  <li className="px-px tracking-[1px]">
                    {crumb.href ? (
                      <Link href={crumb.href} className="hover:underline">
                        {crumb.label}
                      </Link>
                    ) : (
                      /* The last crumb is the current page: styled the same as
                       * the others on the live site, but not a link. */
                      <span aria-current="page">{crumb.label}</span>
                    )}
                  </li>
                </Fragment>
              ))}
            </ol>
          </nav>
        )}
      </div>
    </section>
  );
}
