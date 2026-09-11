"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LOGIN_LINK, MAIN_NAV } from "@/content/navigation";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { MenuToggle } from "./menu-toggle";
import { NavLinks } from "./nav-links";

/**
 * The live drawer (`.wpda-navbar-collapse`), which appears below 1200px.
 *
 * It is not a side sheet: it is a card pinned 12px inside the viewport's top
 * corners that scales up from 0.95 about its top-right corner — the same corner
 * the hamburger sits in — while fading in over 0.2s. The 55px of top padding is
 * there to clear the toggle, which becomes `fixed` at 37px/37px once open and
 * so doubles as the close button.
 *
 * Below 768px the live template hides the red header button and puts Log In
 * inside the drawer instead, as a 100px-wide red pill with a 10px radius. Both
 * of those are the live measurements, odd as the 100px cap looks.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useScrollLock(open);

  // Not on the live site, which leaves the drawer open until the toggle is
  // pressed again. Logged in docs/PARITY.md.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="xl:hidden">
      <MenuToggle
        open={open}
        onClick={() => setOpen((value) => !value)}
        className={open ? "fixed top-[37px] right-[37px] z-[999999]" : undefined}
      />

      <div
        className={
          "fixed inset-x-0 top-0 z-[999998] m-3 w-[calc(100%-24px)] origin-top-right overflow-y-auto px-[25px] pt-[55px] pb-[25px] text-left transition-all duration-200 " +
          (open
            ? "bg-background visible scale-100 rounded-[5px] opacity-100 shadow-[0_50px_100px_rgb(0_0_0/0.05),0_15px_35px_rgb(0_0_0/0.1),0_5px_15px_rgb(0_0_0/0.05)]"
            : "invisible scale-95 opacity-0")
        }
      >
        <nav aria-label="Main" className="max-h-[calc(100vh-105px)]">
          <NavLinks links={MAIN_NAV} className="leading-normal" onNavigate={() => setOpen(false)} />

          <Link
            href={LOGIN_LINK.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="bg-primary text-primary-foreground hover:bg-foreground mt-5 block w-full max-w-[100px] rounded-[10px] text-center leading-normal font-medium tracking-[0.2px] transition-colors md:hidden"
          >
            {LOGIN_LINK.label}
          </Link>
        </nav>
      </div>
    </div>
  );
}
