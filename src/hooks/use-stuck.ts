"use client";

import { type RefObject, useEffect, useRef, useState } from "react";

/**
 * True once a `position: sticky; top: 0` element has actually pinned itself.
 *
 * The live site does this in JS: it swaps the header to `position: fixed` and
 * adds a `sticky_enabled` class that paints the translucent background and drop
 * shadow. We keep the element in flow with `sticky` — no layout jump, no
 * placeholder — so all that is left is knowing *when* to paint, which is
 * exactly when the element's own top edge reaches 0.
 *
 * Reading `getBoundingClientRect().top` rather than comparing `window.scrollY`
 * to a hard-coded offset means the threshold stays correct as the strip above
 * the bar changes height, or disappears entirely below 1024px.
 */
export function useStuck<T extends HTMLElement>(): {
  ref: RefObject<T | null>;
  stuck: boolean;
} {
  const ref = useRef<T>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const read = (): void => setStuck(el.getBoundingClientRect().top <= 0);

    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);

    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, []);

  return { ref, stuck };
}
