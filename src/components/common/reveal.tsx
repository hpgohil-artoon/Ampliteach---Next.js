"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * The live site's entrance animations, in one place.
 *
 * Elementor ships a widget with `.elementor-invisible` (`visibility: hidden`)
 * and, when it scrolls into view, swaps that for `.animated <name>` so the
 * keyframes run once. This does the same, driven by an IntersectionObserver.
 *
 * The classes are toggled on the node directly rather than through state. That
 * is deliberate: it lets the element be hidden in the same frame it mounts, so
 * something above the fold never flashes its final position before animating —
 * and it keeps the component out of the cascading-render trap that
 * `react-hooks/set-state-in-effect` exists to prevent.
 *
 * **Server-rendered visible.** The live site hides these elements in the markup
 * and only reveals them from JS, which is why its headings vanish entirely from
 * a headless capture and for anyone without JS. Here the content ships visible
 * and is hidden only once we know JS is running, so it degrades to "no
 * animation" instead of "no content". Logged as deviation 21.
 *
 * `prefers-reduced-motion` skips the whole thing: no hiding, no animation.
 */
export type RevealAnimation = "slide-in-left" | "slide-in-right" | "zoom-in";

const ANIMATION_CLASS: Record<RevealAnimation, string> = {
  "slide-in-left": "animate-slide-in-left",
  "slide-in-right": "animate-slide-in-right",
  "zoom-in": "animate-zoom-in",
};

export function Reveal({
  children,
  animation,
  className,
  /** `.animated-slow` on the live site — 2s instead of the default 1.25s. */
  slow = false,
  /** Elementor's `_animation_delay`, in milliseconds. */
  delayMs = 0,
}: {
  children: ReactNode;
  animation: RevealAnimation;
  className?: string;
  slow?: boolean;
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Hide first, then reveal on intersection — the live sequence.
    el.style.visibility = "hidden";
    if (slow) el.style.animationDuration = "2s";
    if (delayMs) el.style.animationDelay = `${delayMs}ms`;

    const reveal = () => {
      el.style.visibility = "";
      el.classList.add(ANIMATION_CLASS[animation]);
    };

    // Already on screen at mount: run it now rather than waiting for a scroll.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal();
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      el.style.visibility = "";
    };
  }, [animation, slow, delayMs]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
