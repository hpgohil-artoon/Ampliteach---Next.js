"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "./use-media-query";

/**
 * The live site's typed-text cycle, measured frame by frame off a screen
 * recording of ampliteach.com rather than guessed at.
 *
 * The widget drives Typed.js with `loop: true` and `fadeOut: true` (its span
 * ships with the `typed-fade-out` class), and carries no `data-settings`, so
 * none of the numbers below are in the page — they come from the recording:
 *
 *   type      ~128ms per character on average, 5 chars at t=0.216s through to
 *             15 at t=1.499s. The per-character gaps scatter between 84ms and
 *             283ms, which is Typed.js's `humanizer`: it adds a random
 *             0–50% on top of `typeSpeed`, so a 100ms setting averages 125ms.
 *             Hence TYPE_MS = 100 plus the same jitter.
 *   hold      ~1.2s at full opacity — red pixel count is 9800 ±8 from t=1.4
 *             to t=2.5, i.e. rock steady.
 *   fade      ~300ms; the count falls to 7483 at t=2.71 and 0 by t=2.90.
 *   blank     ~0.9s of nothing, then it retypes. Measured loop period 4.1s.
 *
 * **No cursor.** A blinking `|` would swing the red pixel count by ~130px²
 * every half second; across the whole hold phase it never moves more than 8.
 *
 * `prefers-reduced-motion` gets the finished string and no cycling at all.
 */
const TYPE_MS = 100;
const HOLD_MS = 1200;
const FADE_MS = 300;
const BLANK_MS = 900;

/** Typed.js's own humanizer: `Math.round(Math.random() * speed / 2) + speed`. */
const humanize = (speed: number) => Math.round((Math.random() * speed) / 2) + speed;

export function useTypedText(
  text: string,
  speedMs = TYPE_MS,
): { typed: string; faded: boolean; fadeMs: number } {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [count, setCount] = useState(0);
  const [faded, setFaded] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;

    let cancelled = false;
    let timer = 0;

    // Every setState below runs inside a timeout, never synchronously in the
    // effect body — which is both correct and what react-hooks/set-state-in-
    // effect requires.
    const after = (ms: number, fn: () => void) => {
      timer = window.setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
    };

    let typedCount = 0;

    const typeNext = () => {
      typedCount += 1;
      setCount(typedCount);

      if (typedCount < text.length) after(humanize(speedMs), typeNext);
      else after(HOLD_MS, startFade);
    };

    const startFade = () => {
      setFaded(true);
      after(FADE_MS + BLANK_MS, restart);
    };

    // Restart on the FIRST character, not on an empty string. Typed.js does the
    // same, and it matters: an empty element that is also visible generates no
    // line box, so the row collapses and the whole section reflows for one
    // frame. The live paragraph never moves — measured at y282..388 in every
    // phase of the cycle, including while the eyebrow is invisible.
    const restart = () => {
      typedCount = 1;
      setFaded(false);
      setCount(1);
      after(humanize(speedMs), typeNext);
    };

    after(humanize(speedMs), typeNext);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [text, speedMs, reduceMotion]);

  if (reduceMotion) return { typed: text, faded: false, fadeMs: FADE_MS };
  return { typed: text.slice(0, count), faded, fadeMs: FADE_MS };
}
