"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { LOGIN_LINK, MAIN_NAV } from "@/content/navigation";
import { SITE, SOCIALS } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NavLinks } from "./nav-links";
import { SocialLinks } from "./social-links";

/**
 * The mobile drawer — one of only a handful of client components on the site.
 * Kept as a leaf so the rest of the header renders on the server.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="lg:hidden">
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <Menu className="size-5" aria-hidden />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[85vw] max-w-sm">
        <SheetHeader>
          <SheetTitle>{SITE.name}</SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-6 px-4">
          <NavLinks
            links={MAIN_NAV}
            className="flex flex-col gap-4 text-lg"
            onNavigate={() => setOpen(false)}
          />

          <Button asChild className="w-full">
            <Link href={LOGIN_LINK.href} target="_blank" rel="noopener noreferrer">
              {LOGIN_LINK.label}
            </Link>
          </Button>

          <div className="text-muted-foreground flex flex-col gap-2 text-sm">
            <a href={SITE.phoneHref}>{SITE.phone}</a>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </div>

          <SocialLinks links={SOCIALS} />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
