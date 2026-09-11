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
 *   heading   20px/26px weight 800, white, `letter-spacing: .5px`, with a
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
  "relative pb-5 text-[20px] leading-[26px] font-extrabold tracking-[0.5px] text-white after:absolute after:bottom-0 after:left-0 after:h-1 after:w-[25px] after:rounded-[20px] after:bg-primary after:content-['']";

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
    // NO `font-body` either. Unlike the page sections, none of the live footer's
    // widgets declare a family, so they inherit the site font (Poppins) — and
    // Poppins is wider: with `font-body` the About paragraph wrapped to five
    // lines against the live six, and every line width was out.
    <footer className="mt-auto">
      <section className="bg-footer relative pt-[60px] pb-[60px] text-white lg:pt-[100px] lg:pb-[100px] xl:pt-[200px]">
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

        <Container gutter={false} className="relative max-lg:px-2.5">
          <FooterParticles />

          <div className="relative z-[1] flex flex-col md:flex-row">
            <div className="w-full p-2.5 max-md:px-[5px] md:w-1/3">
              <div className="h-[25px]" />
              <h2 className={HEADING}>About</h2>
              <p className="mt-5 text-[16px] leading-[27px]">{SITE.about}</p>
              <SocialLinks links={SOCIALS} variant="chip" size="lg" className="mt-[33px]" />
            </div>

            <div className="w-full p-2.5 max-md:px-[5px] max-md:pt-[30px] md:w-1/3">
              <div className="h-[25px] max-md:hidden" />
              <h2 className={HEADING}>Quick Links</h2>
              {/* `NavLinks`, not a second list: the live footer menu marks the
               * current page brand red with the same `current-menu-item` rule
               * the header uses, so it is the same mechanism. Only the inactive
               * colour differs, because this one sits on `#222`. */}
              <nav aria-label="Footer">
                <NavLinks
                  links={FOOTER_QUICK_LINKS}
                  className="mt-5 text-[16px]"
                  linkClassName="leading-[30px]"
                  inactiveClassName="text-white"
                />
              </nav>
            </div>

            <div className="w-full p-2.5 max-md:px-[5px] max-md:pt-[30px] md:w-1/3">
              <div className="h-[25px] max-md:hidden" />
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
        </Container>
      </section>

      <FooterCopyright />
    </footer>
  );
}
