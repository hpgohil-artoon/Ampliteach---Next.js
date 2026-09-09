import type { SocialLink } from "@/types";
import { cn } from "@/lib/utils";
import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from "./social-icons";

const ICONS = {
  twitter: TwitterIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
} as const;

export function SocialLinks({
  links,
  className,
  iconClassName,
}: {
  links: SocialLink[];
  className?: string;
  iconClassName?: string;
}) {
  return (
    <ul className={cn("flex items-center gap-3", className)}>
      {links.map((link) => {
        const Icon = ICONS[link.icon];
        return (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary inline-flex transition-colors"
            >
              <Icon className={cn("size-4", iconClassName)} />
              <span className="sr-only">{link.label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
