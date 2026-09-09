import { Mail, Phone } from "lucide-react";
import { SITE, SOCIALS } from "@/content/site";
import { Container } from "@/components/common/container";
import { SocialLinks } from "./social-links";

/** Thin utility strip above the header — phone, email and socials. */
export function TopBar() {
  return (
    <div className="bg-primary text-primary-foreground hidden text-xs lg:block">
      <Container size="wide" className="flex h-10 items-center justify-between">
        <div className="flex items-center gap-6">
          <a href={SITE.phoneHref} className="inline-flex items-center gap-2 hover:underline">
            <Phone className="size-3.5" aria-hidden />
            {SITE.phone}
          </a>
          <a
            href={`mailto:${SITE.email}`}
            className="inline-flex items-center gap-2 hover:underline"
          >
            <Mail className="size-3.5" aria-hidden />
            {SITE.email}
          </a>
        </div>
        <SocialLinks links={SOCIALS} iconClassName="size-3.5" />
      </Container>
    </div>
  );
}
