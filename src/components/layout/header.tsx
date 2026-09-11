import Link from "next/link";
import { LOGIN_LINK, MAIN_NAV } from "@/content/navigation";
import { Button } from "@/components/ui/button";
import { HeaderBar } from "./header-bar";
import { HeaderLogo } from "./header-logo";
import { MobileMenu } from "./mobile-menu";
import { NavLinks } from "./nav-links";
import { TopBar } from "./top-bar";

/**
 * ampliteach.com's header, rebuilt from its own markup and stylesheets.
 *
 * Two Elementor sections: a desktop-only utility strip, then the sticky main
 * bar — 110px tall, dropping to 80px below 768px — holding the logo, the nav
 * and the red Log In button.
 *
 * Three distinct layouts, each a real live breakpoint rather than a guess:
 *
 *   ≥1200   strip · logo · horizontal nav · Log In
 *   768–1199  strip only above 1024 · logo · hamburger · Log In
 *   ≤767    logo · hamburger, with Log In inside the drawer
 *
 * The nav collapses at 1200px, not at 1024px — `.wpda-mobile-navigation-toggle`
 * is the live boundary, and it is `max-width: 1199px`. The live template also
 * drops the phone, email and socials entirely below 1024px rather than moving
 * them into the drawer, so neither do we; the footer carries them.
 *
 * Order matters and is easy to get backwards: the live menu widget sits *before*
 * the button in the DOM, so on a tablet the hamburger is to the left of Log In,
 * not to the right of it.
 */
export function Header() {
  return (
    <header>
      <TopBar />

      <HeaderBar>
        <div className="max-w-wide mx-auto flex min-h-20 items-center px-[5px] md:min-h-[110px] md:px-[15px] lg:px-0 lg:pl-[10px]">
          <HeaderLogo />

          <div className="ml-auto flex items-center">
            <nav aria-label="Main" className="hidden xl:block">
              {/* 15px left + 10px right per item, and `line-height: 5` — 80px of
               * hit area inside the 110px bar, which is where the nav's optical
               * centring comes from. */}
              <NavLinks
                links={MAIN_NAV}
                className="flex items-center"
                linkClassName="mr-[10px] ml-[15px] text-base leading-[5]"
              />
            </nav>

            <MobileMenu />

            {/* Padding, radius, 12px uppercase label and the #0B0B0B hover all
             * come from `components/ui/button.tsx` — the site's one button
             * definition. Nothing button-shaped is styled locally. */}
            <Button asChild className="ml-[30px] hidden md:inline-flex">
              <Link href={LOGIN_LINK.href} target="_blank" rel="noopener noreferrer">
                {LOGIN_LINK.label}
              </Link>
            </Button>
          </div>
        </div>
      </HeaderBar>
    </header>
  );
}
