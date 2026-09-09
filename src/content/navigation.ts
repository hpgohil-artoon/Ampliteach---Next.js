import type { NavLink } from "@/types";
import { EXTERNAL, ROUTES } from "@/lib/constants/routes";

export const MAIN_NAV: NavLink[] = [
  { label: "Home", href: ROUTES.home },
  { label: "Why Choose Us", href: ROUTES.whyChooseUs },
  { label: "Features & Benefits", href: ROUTES.featuresAndBenefits },
  { label: "Pricing", href: ROUTES.pricing },
  { label: "Blog", href: ROUTES.blog },
  { label: "Contact Us", href: ROUTES.contact },
];

/** The product app is a separate system — we only link out to it. */
export const LOGIN_LINK: NavLink = {
  label: "Log In",
  href: EXTERNAL.login,
  external: true,
};

export const FOOTER_QUICK_LINKS: NavLink[] = [
  { label: "Home", href: ROUTES.home },
  { label: "Why Choose Us", href: ROUTES.whyChooseUs },
  { label: "Features & Benefits", href: ROUTES.featuresAndBenefits },
  { label: "Little Rockers Program", href: ROUTES.littleRockers },
  { label: "Contact Us", href: ROUTES.contact },
];

export const FOOTER_LEGAL_LINKS: NavLink[] = [
  { label: "Privacy Policy", href: ROUTES.privacyPolicy },
  { label: "Terms of Service", href: ROUTES.termsOfService },
];
