"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Matches a CSS media query in JS.
 *
 * Uses useSyncExternalStore rather than useState + useEffect: matchMedia is an
 * external store, and reading it this way avoids the cascading extra render
 * (and the react-hooks/set-state-in-effect lint error) that the effect-based
 * version causes. The server snapshot is `false`, so the first client render
 * agrees with the static HTML and hydration stays clean.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onStoreChange);
      return () => list.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
