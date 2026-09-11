import Link from "next/link";
import { SITE } from "@/content/site";
import { ROUTES } from "@/lib/constants/routes";
import { Img } from "@/components/common/img";

/**
 * The live header ships two separate logo widgets and shows one at a time —
 * `e79fd48` (222×70) above 1024px and `416a9a1` (165×52) at or below it, each a
 * different upload rather than one image scaled. Both carry the same
 * `margin: 0 68px 0 0; padding: 10px 0 0 0`, which is what keeps the wordmark
 * off the nav and optically centred against the 110px bar.
 *
 * Rendered as one link with two images so the whole thing stays a single tap
 * target, matching the live column, which is itself clickable.
 */
export function HeaderLogo() {
  return (
    <Link href={ROUTES.home} className="mr-[68px] block shrink-0 pt-[10px]">
      <Img
        src="/images/ampliteach-logo.webp"
        alt={SITE.name}
        width={222}
        height={70}
        priority
        className="hidden h-auto w-[222px] lg:block"
      />
      <Img
        src="/images/ampliteach-logo-compact.webp"
        alt={SITE.name}
        width={165}
        height={52}
        priority
        className="h-auto w-[165px] lg:hidden"
      />
    </Link>
  );
}
