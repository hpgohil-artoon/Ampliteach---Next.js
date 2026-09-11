"use client";

import { cn } from "@/lib/utils";

/**
 * The live hamburger, rebuilt from `.wpda-toggle-*`.
 *
 * A 22×22 box holding one 2px bar plus its `::before`/`::after`, offset −9px and
 * +7px — not a symmetrical set, which is why the top gap reads slightly wider
 * than the bottom one on the live site. `currentColor` is inherited from the
 * bar's `color: #3B3663` (--header-ink), the only place that theme leftover is
 * actually visible.
 *
 * Open, it collapses to an X exactly as the live site does: the middle bar
 * rotates 45°, the top one fades out at zero offset, the bottom one rotates
 * −90° — and both moving bars shrink 22px → 20px, so the cross sits inside the
 * same box. The staggered .1s/.14s timings are the live values.
 */
export function MenuToggle({
  open,
  onClick,
  className,
}: {
  open: boolean;
  onClick: () => void;
  className?: string;
}) {
  const bar = "absolute block h-0 w-[22px] border-t-2 border-current";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      className={cn("text-header-ink relative size-[22px] cursor-pointer align-middle", className)}
    >
      {/* The middle bar; the two pseudo-element bars are real spans here. */}
      <span
        className={cn(
          bar,
          "top-[calc(50%-2px)] -mt-px transition-transform duration-100",
          open
            ? "w-5 rotate-45 delay-[0.14s] ease-[cubic-bezier(0.215,0.61,0.355,1)]"
            : "ease-[cubic-bezier(0.55,0.055,0.675,0.19)]",
        )}
      />
      <span
        className={cn(
          bar,
          open
            ? "top-0 opacity-0 transition-[top,opacity] [transition-delay:0s,0.14s] duration-100"
            : "top-[-9px] transition-[top,opacity] [transition-delay:0.14s,0s] duration-100",
        )}
      />
      <span
        className={cn(
          bar,
          "transition-[bottom,transform] duration-100",
          open
            ? "bottom-0 w-5 -rotate-90 [transition-delay:0s,0.14s] ease-[cubic-bezier(0.215,0.61,0.355,1)]"
            : "bottom-[-7px] [transition-delay:0.14s,0s] ease-[cubic-bezier(0.55,0.055,0.675,0.19)]",
        )}
      />
    </button>
  );
}
