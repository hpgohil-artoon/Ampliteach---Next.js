import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Vertical rhythm wrapper. Every page section uses this so spacing is
 * consistent site-wide and never set with ad-hoc margins.
 */
export function Section({
  children,
  className,
  id,
  as: Tag = "section",
  tone = "default",
  spacing = "default",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: ElementType;
  tone?: "default" | "muted" | "accent";
  spacing?: "default" | "tight" | "loose";
}) {
  return (
    <Tag
      id={id}
      className={cn(
        "relative",
        spacing === "tight" && "py-10 sm:py-14",
        spacing === "default" && "py-16 sm:py-20 lg:py-24",
        spacing === "loose" && "py-20 sm:py-28 lg:py-32",
        tone === "muted" && "bg-muted/40",
        tone === "accent" && "bg-primary text-primary-foreground",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
