"use client";

import type { ReactNode } from "react";
import { useStuck } from "@/hooks/use-stuck";
import { cn } from "@/lib/utils";

/**
 * The header's main bar — Elementor section `bbf218a`, stretched edge to edge
 * with `padding: 0 2%`, and sticky at every breakpoint.
 *
 * The live site pins it with `position: fixed` from JS and paints the
 * translucent white plus `0 0 7px rgba(0,0,0,.1)` shadow through a
 * `sticky_enabled` class. We use `position: sticky` instead, which pins at the
 * same scroll offset without needing a placeholder to stop the page jumping by
 * the bar's height. `useStuck` reports the moment it pins, so the fade to
 * translucent is timed exactly as it is on the live site.
 *
 * A client component only to hold that one boolean — `children` is composed on
 * the server and passed straight through.
 */
export function HeaderBar({ children }: { children: ReactNode }) {
  const { ref, stuck } = useStuck<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "sticky top-0 z-[99] px-[2%] transition-[background-color,box-shadow] duration-300",
        stuck && "bg-background/95 shadow-[0_0_7px_0_rgb(0_0_0/0.1)]",
      )}
    >
      {children}
    </div>
  );
}
