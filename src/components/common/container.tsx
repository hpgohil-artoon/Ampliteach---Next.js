import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The site's single horizontal gutter. Change the max width here, once.
 *
 * Widths come from the --container-* tokens in globals.css, which are measured
 * off ampliteach.com: `site` 1170px (page content), `wide` 1220px (the header's
 * unclipped Elementor container).
 *
 * FLUID, unlike the live site. Its container is a stepped fixed width
 * (1170 → 998 → 740 → 560 → 420, then 90% under 480px), which leaves dead
 * space between the steps: 142px each side at a 1024px viewport, 104px at
 * 768px — iPad landscape and portrait exactly. Desktop is identical either
 * way, so this keeps the live width where it is visible and drops the empty
 * margins where they are not defensible. To go back to the live steps, the
 * change is confined to this file.
 *
 * The gutter (20/24/32px) already matches the live site's ~19px at 375px.
 */
export function Container({
  children,
  className,
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-6 lg:px-8",
        size === "narrow" && "max-w-3xl",
        size === "default" && "max-w-site",
        size === "wide" && "max-w-wide",
        className,
      )}
    >
      {children}
    </div>
  );
}
