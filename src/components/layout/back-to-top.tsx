"use client";

import { useEffect, useRef } from "react";

/**
 * The scroll-to-top button — live `#back_to_top`, measured from its stylesheets.
 *
 *   box       40 × 40, `border-radius: 5px`, no border
 *   colour    brand red `#FF1616`, white glyph → `#222` on hover
 *   glyph     Font Awesome `\f106` (`angle-up`) at 26px, centred
 *   position  `position: fixed`, 40px from the right and bottom
 *             · 25px at ≤600px
 *   state     `opacity: 0; pointer-events: none` until it gains `.show`,
 *             over a `.3s` transition
 *
 * **The button has no dark plate behind it** — the brand-red box sits directly
 * on whatever the page is showing at that scroll position. It only looks like
 * it is on black in a screenshot taken over the copyright bar.
 *
 * Visibility is toggled by writing classes onto the node rather than with
 * state, so scrolling never re-renders React — the same approach `Reveal` uses,
 * and it keeps the scroll listener cheap. The listener is `passive` for the
 * same reason.
 *
 * Server-rendered hidden, which is correct here rather than a compromise: at
 * scroll 0 the live button is hidden too, and that is where every page starts.
 */
export function BackToTop() {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const sync = () => {
      // The live script shows it as soon as the page has moved at all, which is
      // why a small nudge is enough to bring it back.
      const show = window.scrollY > 0;

      // REMOVE `pointer-events-none`; do not add `pointer-events-auto`
      // alongside it. Both utilities have the same specificity, so with both
      // present the winner is whichever Tailwind emits later in the stylesheet
      // — which was `none`, leaving the button visible but permanently
      // unclickable. `auto` is the default, so dropping `none` is enough.
      node.classList.toggle("pointer-events-none", !show);
      node.classList.toggle("opacity-0", !show);
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="bg-primary hover:bg-footer pointer-events-none fixed right-[25px] bottom-[25px] z-[3] flex size-10 cursor-pointer items-center justify-center rounded-[5px] text-white opacity-0 transition-all duration-300 sm:right-10 sm:bottom-10"
    >
      {/* Font Awesome's `angle-up` outline, so the chevron matches the live
       * glyph rather than a lookalike from an icon package. */}
      <svg viewBox="0 0 256 512" fill="currentColor" aria-hidden className="h-[26px]">
        <path d="M136.5 185.1l116.5 116.5c4.7 4.7 4.7 12.3 0 17l-19.8 19.8c-4.7 4.7-12.3 4.7-17 0L128 229.3 39.8 338.4c-4.7 4.7-12.3 4.7-17 0L3 318.6c-4.7-4.7-4.7-12.3 0-17l116.5-116.5c4.7-4.7 12.3-4.7 17 0z" />
      </svg>
    </button>
  );
}
