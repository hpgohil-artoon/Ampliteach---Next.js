import Link from "next/link";
import { LOGIN_LINK, MAIN_NAV } from "@/content/navigation";
import { SITE } from "@/content/site";
import { ROUTES } from "@/lib/constants/routes";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";
import { MobileMenu } from "./mobile-menu";
import { NavLinks } from "./nav-links";
import { TopBar } from "./top-bar";

export function Header() {
  return (
    <header className="border-border/60 bg-background/95 sticky top-0 z-50 border-b backdrop-blur">
      <TopBar />

      <Container size="wide" className="flex h-16 items-center justify-between gap-6 lg:h-20">
        <Link href={ROUTES.home} className="font-heading text-xl font-bold tracking-tight">
          {SITE.name}
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <NavLinks links={MAIN_NAV} className="flex items-center gap-7 text-sm" />
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden lg:inline-flex">
            <Link href={LOGIN_LINK.href} target="_blank" rel="noopener noreferrer">
              {LOGIN_LINK.label}
            </Link>
          </Button>
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
