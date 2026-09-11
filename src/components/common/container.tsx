import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The site's single horizontal gutter. Change the max width here, once.
 *
 * Widths come from the --container-* tokens in globals.css, both measured off
 * ampliteach.com. Which one a page needs depends on how WordPress renders it:
 *
 *   `default` / `wide`  1220px — every Elementor page: the whole marketing
 *                       site, plus /blog. Verified by measurement (the live
 *                       hero's first ink is at x=341 on a 1901px viewport;
 *                       a centred 1220px box starts at 340.5).
 *   `post`              1170px — single posts only, which are theme-rendered
 *                       and so genuinely do get `.container{width:1170px}`.
 *   `narrow`            prose width, for the legal stubs. No live equivalent.
 *
 * `default` and `wide` are deliberately the same width: `wide` predates the
 * measurement, when the header was thought to be the only thing escaping a
 * 1170px theme container. Nothing escapes it, because on an Elementor page
 * that container is `width:100%`. Kept as an alias so the header and footer
 * did not need touching.
 *
 * FLUID, unlike the live post template, whose 1170 → 998 → 740 → 560 → 420
 * steps leave dead space between breakpoints (142px each side at 1024px).
 * Reverting to the steps is confined to this file.
 *
 * The gutter (20/24/32px) already matches the live site's ~19px at 375px.
 */
export function Container({
  children,
  className,
  size = "default",
  gutter = true,
}: {
  children: ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide" | "post";
  /**
   * `false` drops the horizontal padding, which is what an Elementor content
   * section needs: its 1220px box is flush, and the inset comes from the
   * column's own percentage padding instead. Measured — the live hero's text
   * starts at x=340.5, exactly the box edge, so any gutter here pushes the
   * whole section in by that much.
   */
  gutter?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        gutter && "px-5 sm:px-6 lg:px-8",
        size === "narrow" && "max-w-3xl",
        size === "post" && "max-w-site",
        (size === "default" || size === "wide") && "max-w-wide",
        className,
      )}
    >
      {children}
    </div>
  );
}
