import { SITE, SOCIALS } from "@/content/site";
import { EnvelopeOpenIcon, PhoneIcon } from "@/components/common/contact-icons";
import { SocialLinks } from "./social-links";

/**
 * The utility strip above the header — Elementor section `435d824`.
 *
 * Measured off ampliteach.com's stylesheets:
 *   min-height 46px, border-bottom 1px #F0EFF3 (--hairline)
 *   phone/email: icon 14px #FF1616 + 3.5px, text 14px #0B0B0B + 5px, 20px apart
 *   socials: 12px glyph in a 31.2px round chip, #0B0B0B → #FF1616 on hover
 *
 * The live columns are asymmetric and it is not a mistake: the left column
 * keeps Elementor's 10px gap padding, the right column is explicitly zeroed, so
 * the text sits 10px inside the 1220px box while the chips sit flush to its
 * right edge. Reproduced as measured.
 *
 * Hidden at ≤1024px — the live template drops the whole section there, which is
 * why the phone, email and socials reappear inside the mobile drawer.
 */
export function TopBar() {
  return (
    <div className="border-hairline hidden border-b lg:block">
      <div className="max-w-wide mx-auto flex min-h-[46px] items-center justify-between">
        {/* No hover state anywhere in here, deliberately. The live section does
         * set `a:hover{color:#5747E4}`, but both the glyph and the label carry
         * their own colour on a child element, so nothing of it ever renders. */}
        <ul className="flex items-center gap-5 pl-[10px] text-sm">
          <li>
            <a href={SITE.phoneHref} className="flex items-center gap-[8.5px]">
              <PhoneIcon className="text-primary size-3.5 shrink-0" />
              {SITE.phone}
            </a>
          </li>
          <li>
            <a href={`mailto:${SITE.email}`} className="flex items-center gap-[8.5px]">
              <EnvelopeOpenIcon className="text-primary size-3.5 shrink-0" />
              {SITE.email}
            </a>
          </li>
        </ul>

        <SocialLinks links={SOCIALS} variant="chip" />
      </div>
    </div>
  );
}
