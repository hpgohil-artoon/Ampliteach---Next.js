"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLink } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Client component only because it reads the current pathname to mark the
 * active link. Everything else in the header stays on the server.
 */
export function NavLinks({
  links,
  className,
  linkClassName,
  onNavigate,
}: {
  links: NavLink[];
  className?: string;
  linkClassName?: string;
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
              "hover:text-primary transition-colors",
              isActive(link.href) ? "text-primary font-semibold" : "text-foreground/80",
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
