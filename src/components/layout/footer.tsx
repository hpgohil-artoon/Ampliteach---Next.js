import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FOOTER_LEGAL_LINKS, FOOTER_QUICK_LINKS } from "@/content/navigation";
import { SITE, SITE_ADDRESS_LINE, SOCIALS } from "@/content/site";
import { Container } from "@/components/common/container";
import { SocialLinks } from "./social-links";

export function Footer() {
  const year = new Date().getFullYear();
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${SITE.geo.latitude},${SITE.geo.longitude}`;

  return (
    <footer className="border-border bg-muted/40 mt-auto border-t">
      <Container size="wide" className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-4">
          <h2 className="font-heading text-lg font-semibold">About</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">{SITE.about}</p>
          <SocialLinks links={SOCIALS} className="mt-2" />
        </div>

        <nav aria-label="Quick links" className="flex flex-col gap-4">
          <h2 className="font-heading text-lg font-semibold">Quick Links</h2>
          <ul className="flex flex-col gap-2.5 text-sm">
            {FOOTER_QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-muted-foreground hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-4">
          <h2 className="font-heading text-lg font-semibold">Get In Touch</h2>
          <ul className="text-muted-foreground flex flex-col gap-3 text-sm">
            <li>
              <a href={`mailto:${SITE.email}`} className="hover:text-primary inline-flex gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0" aria-hidden />
                {SITE.email}
              </a>
            </li>
            <li>
              <a href={SITE.phoneHref} className="hover:text-primary inline-flex gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0" aria-hidden />
                {SITE.phone}
              </a>
            </li>
            <li>
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary inline-flex gap-2.5"
              >
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                {SITE_ADDRESS_LINE}
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-border border-t">
        <Container
          size="wide"
          className="text-muted-foreground flex flex-col items-center justify-between gap-3 py-6 text-xs sm:flex-row"
        >
          <p>
            © {year} — {SITE.name}. All Rights Reserved.
          </p>
          <ul className="flex items-center gap-5">
            {FOOTER_LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  );
}
