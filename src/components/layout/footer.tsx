import { FOOTER_QUICK_LINKS } from "@/content/navigation";
import { SITE, SITE_ADDRESS_LINE, SOCIALS } from "@/content/site";
import { Container, EnvelopeOpenIcon, MapMarkedIcon, PhoneIcon } from "@/components/common";
import { FooterCopyright } from "./footer-copyright";
import { FooterParticles } from "./footer-particles";
import { NavLinks } from "./nav-links";
import { SocialLinks } from "./social-links";

/**
 * The site footer — live section `a6cf32d` (`footer_widgets`), measured from
 * its stylesheets and a browser screenshot.
 *
 *   ground    `#222` (`--footer`), boxed 1220px
 *   padding   `200px 0 100px` · `100px 0` ≤1024 · `60px 0` ≤767
 *   divider   a white "tilt" wedge across the top, height = width / 10
 *   columns   three equal thirds, each with Elementor's 10px column gap
 *   spacer    25px above each heading
 *   heading   20px/26px weight 900, white, `letter-spacing: .5px`, with a
 *             25×4px brand-red bar pinned to the bottom of its own box
 *   body      16px/27px white
 *   links     white, brand red on hover and for the current page
 *
 * The 200px top padding is not decoration — it is what clears the 190px
 * divider at a 1903px viewport.
 *
 * Every column's content starts exactly 20px below the heading box. The live
 * menu and icon-list widgets declare their own `padding-top` (15px and 20px),
 * but measurement says those do not reach the render: all three columns' first
 * line lands within 2px of the same y. Reproduced as measured, not as declared.
 */

/** 25px spacer + the heading's own 20px bottom margin, in one place. */
const HEADING =
  "relative pb-5 text-[20px] leading-[26px] font-black tracking-[0.5px] text-white after:absolute after:bottom-0 after:left-0 after:h-1 after:w-[25px] after:rounded-[20px] after:bg-primary after:content-['']";

const CONTACT = [
  { Icon: EnvelopeOpenIcon, label: SITE.email, href: `mailto:${SITE.email}` },
  { Icon: PhoneIcon, label: SITE.phone, href: SITE.phoneHref },
  { Icon: MapMarkedIcon, label: SITE_ADDRESS_LINE, href: undefined },
] as const;

export function Footer() {
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${SITE.geo.latitude},${SITE.geo.longitude}`;

  return (
    // The `<footer>` is a bare wrapper. The ground and the padding belong to
    // the SECTION inside it, because the copyright bar is a separate live
    // section that follows it — with them on the wrapper, the footer's 60–100px
    // of bottom padding rendered *below* the black bar as a strip of `#222`.
    //
    // NO `font-body`. Unlike the page sections, none of the live footer's
    // widgets declare a family, so the whole footer inherits `body`'s Poppins.
    // Confirmed in real Chrome: the About paragraph rasterises 230 glyphs of
    // Poppins, and these headings paint Poppins Medium — the live site loads
    // only weights 400 and 500, so their declared 900 is a synthesised bold.
    // Adding `font-body` here would put the footer in Arial, which is narrower:
    // the About paragraph then wrapped to five lines against the live six.
    <footer className="mt-auto">
      {/* Padding is `200px 0 100px` on DESKTOP (≥1025), `100px 0` on TABLET
       * (768–1024) and `60px 0` on mobile. It was previously keyed to `lg`/`xl`,
       * which got both non-desktop bands wrong: 768–1023 took the mobile 60px
       * (the footer sat 40px high and 91px short at 768) and 1025–1199 took the
       * tablet 100px instead of 200px. `md:` and `desktop:` land on Elementor's
       * real boundaries — see deviation 16. */}
      <section className="bg-footer desktop:pt-[200px] relative pt-[60px] pb-[60px] text-white md:pt-[100px] md:pb-[100px]">
        {/* The live "tilt" shape divider. `preserveAspectRatio="none"` plus a
         * width-only size gives it the viewBox's 10:1 ratio, which is where the
         * 190px height at a 1903px viewport comes from. The extra 1.3px of
         * width is Elementor's own hack against a subpixel seam at the edges. */}
        <div className="pointer-events-none absolute inset-x-0 -top-px z-[2] overflow-hidden leading-[0]">
          <svg
            viewBox="0 0 1000 100"
            preserveAspectRatio="none"
            aria-hidden
            className="relative left-1/2 block w-[calc(100%+1.3px)] -translate-x-1/2"
          >
            <path d="M0,6V0h1000v100L0,6z" className="fill-background" />
          </svg>
        </div>

        {/* TWO boxes, because the live footer has two: a boxed OUTER container
         * carrying Elementor's own responsive inset (0 / 3 / 4 / 10 / 20px as
         * the viewport narrows), and an INNER SECTION inside it. Collapsing them
         * into one is what put the columns 4px out at 768 and 10px out at 480 —
         * the two insets stack, so at 480 the live copy starts at 30px, not 20.
         *
         * The particles stay on the OUTER container: measured, their offsets
         * resolve against it, not the inner section. */}
        <Container gutter="elementor">
          {/* This wrapper is what the particles are positioned against, and it
           * has to exist: `absolute` resolves against the nearest positioned
           * ancestor's PADDING box, so anchoring to `Container` would ignore the
           * container's own inset and put every particle 3–20px out as the
           * viewport narrows. A plain child's border box IS the content box. */}
          <div className="relative">
            <FooterParticles />

            {/* The inner section: `padding: 0 10px` up to 1024, `0 0 16px` on
             * desktop. The 16px is bottom-only, so it lengthens the band without
             * moving any column — without it the footer measured 623.19px
             * against the live 639.19 and the copyright bar sat 16px high. */}
            <div className="desktop:px-0 desktop:pb-4 relative px-2.5">
              <div className="relative z-[1] flex flex-col md:flex-row">
                {/* Column padding is 10px all round from 768 up. Once the columns
                 * STACK, the live wrap padding becomes `0 5px` on the first and
                 * `30px 5px 0` on the other two — no vertical padding at all, with
                 * the 30px above the second and third standing in for the gap the
                 * row used to provide. */}
                <div className="w-full p-2.5 max-md:px-[5px] max-md:pt-0 max-md:pb-0 md:w-1/3">
                  <div className="h-[25px]" />
                  <h2 className={HEADING}>About</h2>
                  <p className="mt-5 text-[16px] leading-[27px]">{SITE.about}</p>
                  <SocialLinks links={SOCIALS} variant="chip" size="lg" className="mt-[33px]" />
                </div>

                <div className="w-full p-2.5 max-md:px-[5px] max-md:pt-[30px] max-md:pb-0 md:w-1/3">
                  {/* The 25px spacer is present in ALL THREE columns at every width,
                   * including stacked. Hiding it below `md` put this heading 25px
                   * high there. */}
                  <div className="h-[25px]" />
                  <h2 className={HEADING}>Quick Links</h2>
                  {/* `NavLinks`, not a second list: the live footer menu marks the
                   * current page brand red with the same `current-menu-item` rule
                   * the header uses, so it is the same mechanism. Only the inactive
                   * colour differs, because this one sits on `#222`. */}
                  {/* `scale-95` is not styling — it is the live render. The WPDA
                   * menu plugin wraps this one menu in
                   * `div.wpda-navbar-collapse { transform: matrix(.95,0,0,.95,0,0) }`
                   * with `transform-origin: 0 50%`, so the middle footer column's
                   * type really is 5% smaller than the two columns either side of
                   * it. Measured: the live link inks 142.68px where the same string
                   * unscaled inks 150.19 (×0.95 = 142.68), and the item pitch is
                   * 29.63px against the declared 31.2 (×0.95 = 29.64).
                   *
                   * So the declared line-heights below are the live DECLARED ones —
                   * 31.2px on the link, 32px on the item — and the wrapper scales
                   * them down to what renders. Collapsing the two into a single
                   * "30px" would land 1.4px out per row and 8px out over the
                   * column. The left origin is why the column does not also shift:
                   * live and local both put the link's left edge at x=766.66.
                   *
                   * An obvious plugin accident, reproduced rather than corrected —
                   * see the deviation log in docs/PARITY.md. */}
                  {/* `mt-[15px]`, and it is the one column of the three that is
                   * not 20px: the live menu widget's container declares
                   * `padding-top: 15px` where the About text and the icon list
                   * both get 20px. Measured — the live scaled menu box sits at
                   * +18.9px inside its widget, which is that 15px plus the 3.9px
                   * the 0.95 scale drops its top edge by.
                   *
                   * It sits OUTSIDE the scale, as it does live: the gap belongs to
                   * the widget container and only the menu is scaled, so the 15px
                   * must not be shrunk to 14.25. */}
                  <nav aria-label="Footer" className="mt-[15px] origin-left scale-95">
                    <NavLinks
                      links={FOOTER_QUICK_LINKS}
                      className="text-[16px] leading-[32px]"
                      linkClassName="leading-[31.2px]"
                      inactiveClassName="text-white"
                    />
                  </nav>
                </div>

                <div className="w-full p-2.5 max-md:px-[5px] max-md:pt-[30px] max-md:pb-0 md:w-1/3">
                  <div className="h-[25px]" />
                  <h2 className={HEADING}>Get In Touch</h2>
                  {/* 7.5px above and 7.5px below each item — the live
                   * `calc(15px/2)` pair — which with the 27px line box gives the
                   * 42px item pitch the screenshot measures. */}
                  <ul className="mt-5 text-[16px]">
                    {CONTACT.map(({ Icon, label, href }) => (
                      <li
                        key={label}
                        className="flex items-start not-first:mt-[7.5px] not-last:pb-[7.5px]"
                      >
                        {/* `mr-1` is the live `--e-icon-list-icon-margin: 0
                         * calc(16px * 0.25) 0 0` — 4px. Without it every row sat
                         * 4px narrower than the live one, the text starting 28px
                         * after the icon's left edge instead of 32px. */}
                        <Icon className="mt-[5.5px] mr-1 h-4 w-4 shrink-0" />
                        <a
                          href={href ?? mapsHref}
                          className="hover:text-primary pl-3 leading-[27px] transition-colors"
                          {...(href ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                        >
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <FooterCopyright />
    </footer>
  );
}
