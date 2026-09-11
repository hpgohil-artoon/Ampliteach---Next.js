import type { SocialLink } from "@/types";
import { cn } from "@/lib/utils";
import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from "./social-icons";

const ICONS = {
  twitter: TwitterIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
} as const;

/**
 * `plain` is a bare glyph that takes its colour from the surrounding text.
 *
 * `chip` is the round #0B0B0B badge that turns brand red on hover, used in the
 * header top bar and again in the footer. Both boxes are Elementor's own
 * arithmetic and neither is a guess: the widget sets `--icon-size` and
 * `--icon-padding: 0.8em`, the em resolves against the glyph, so the box comes
 * to `icon × (1 + 2 × 0.8)` = **icon × 2.6**.
 *
 *   sm  12px glyph → 31.2px box   (header, `--icon-size: 12px`)
 *   lg  17px glyph → 44.2px box   (footer, `--icon-size: 17px`)
 *
 * Sizes are named rather than computed because Tailwind cannot build a class
 * from a runtime value — but the two pairs come from that one formula, so a
 * third size is one line, not a new mechanism.
 */
type SocialVariant = "plain" | "chip";
type ChipSize = "sm" | "lg";

const CHIP_SIZE: Record<ChipSize, { box: string; glyph: string; gap: string }> = {
  sm: { box: "size-[31.2px]", glyph: "size-3", gap: "gap-2.5" },
  lg: { box: "size-[44.2px]", glyph: "size-[17px]", gap: "gap-2.5" },
};

export function SocialLinks({
  links,
  className,
  iconClassName,
  variant = "plain",
  size = "sm",
}: {
  links: SocialLink[];
  className?: string;
  iconClassName?: string;
  variant?: SocialVariant;
  /** Chip box size. Ignored by `plain`. */
  size?: ChipSize;
}) {
  const chip = variant === "chip";
  const chipSize = CHIP_SIZE[size];

  return (
    <ul className={cn("flex items-center", chip ? chipSize.gap : "gap-3", className)}>
      {links.map((link) => {
        const Icon = ICONS[link.icon];
        return (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex transition-colors",
                chip
                  ? cn(
                      "bg-foreground text-primary-foreground hover:bg-primary items-center justify-center rounded-full",
                      chipSize.box,
                    )
                  : "hover:text-primary",
              )}
            >
              <Icon className={cn(chip ? chipSize.glyph : "size-4", iconClassName)} />
              <span className="sr-only">{link.label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
