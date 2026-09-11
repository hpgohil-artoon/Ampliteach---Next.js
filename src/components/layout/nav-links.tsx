"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLink } from "@/types";
import { cn } from "@/lib/utils";

/**
 * The header's link list, shared by the desktop bar and the mobile drawer —
 * the live site reuses one `<ul id="menu-top-menu">` for both and only restyles
 * it, so this does the same.
 *
 * The active item is measured as brand red and *nothing else*: the live
 * `current-menu-item > a` rule changes colour only, with no weight change, so
 * the row does not reflow as you navigate.
 *
 * Client-only because it reads the current pathname. Everything else in the
 * header stays on the server.
 */
export function NavLinks({
  links,
  className,
  linkClassName,
  inactiveClassName = "text-foreground",
  onNavigate,
}: {
  links: NavLink[];
  className?: string;
  linkClassName?: string;
  /**
   * Colour for the links that are not the current page. The default is the
   * header's dark ink; the footer passes white, because it sits on `#222` and
   * marks its current page brand red exactly as the header does.
   */
  inactiveClassName?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <ul className={className}>
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            onClick={onNavigate}
            aria-current={isActive(link.href) ? "page" : undefined}
            className={cn(
              "hover:text-primary block transition-colors",
              isActive(link.href) ? "text-primary" : inactiveClassName,
              linkClassName,
            )}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
