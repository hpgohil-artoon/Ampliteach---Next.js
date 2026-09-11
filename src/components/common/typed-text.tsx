"use client";

import { useTypedText } from "@/hooks/use-typed-text";
import { cn } from "@/lib/utils";

/**
 * The live site's typed-text widget: types, holds, fades out, retypes, forever.
 * Timings and the absence of a cursor are measured — see `useTypedText`.
 *
 * Two details keep the section from flickering, both matching the live site,
 * whose paragraph measures y282..388 in *every* phase of the cycle:
 *
 * 1. A zero-width space is always rendered alongside the typed characters. An
 *    element with no content generates no line box, so without it the row
 *    collapses — on first paint, and again on every loop — and because the hero
 *    grid is `items-center`, that reflows the paragraph, the CTA and the video
 *    with it. The ZWSP has no advance width, so it reserves the line box
 *    without shifting anything horizontally.
 * 2. The fade-out transitions, the fade-in does not. Typed.js drops its
 *    `typed-fade-out` class outright when it restarts, so the first character
 *    of the next cycle appears at full opacity rather than easing in.
 *
 * The full string is also rendered in an `sr-only` span, so the text is in the
 * document for screen readers and when JS never runs. The live widget empties
 * its element instead, which is why the heading is simply missing from a
 * headless capture of ampliteach.com.
 */
export function TypedText({
  text,
  className,
  speedMs,
}: {
  text: string;
  className?: string;
  speedMs?: number;
}) {
  const { typed, faded, fadeMs } = useTypedText(text, speedMs);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span
        aria-hidden
        className={cn(faded ? "opacity-0 transition-opacity" : "opacity-100")}
        style={faded ? { transitionDuration: `${fadeMs}ms` } : undefined}
      >
        {typed}
        {/* Zero-width space, written as an escape so it is visible in source. */}
        {"\u200B"}
      </span>
    </span>
  );
}
