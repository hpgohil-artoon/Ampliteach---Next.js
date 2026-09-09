import type { SocialLink } from "@/types";

/** Single source of truth for business details. Used by header, footer and JSON-LD. */
export const SITE = {
  name: "AmpliTeach",
  tagline: "All-in-One Music School Management Software",
  description:
    "AmpliTeach is the ultimate all-in-one music school management software — lesson scheduling, student and parent communication, automated alerts, payments, invoicing and payroll in one platform.",
  email: "Support@AmpliTeach.com",
  phone: "203-934-2501",
  phoneHref: "tel:+12039342501",
  address: {
    street: "393 Center Street",
    city: "Wallingford",
    state: "CT",
    postalCode: "06492",
    country: "US",
  },
  geo: { latitude: 41.4534943, longitude: -72.8168593 },
  about:
    "AmpliTeach has been described as innovative, groundbreaking and radical. Built by music school owners with over 25 years of combined experience.",
} as const;

export const SITE_ADDRESS_LINE = `${SITE.address.street} ${SITE.address.city} ${SITE.address.state} ${SITE.address.postalCode}`;

export const SOCIALS: SocialLink[] = [
  { label: "Twitter", href: "https://twitter.com/ampliteach", icon: "twitter" },
  { label: "Facebook", href: "https://www.facebook.com/ampliteach", icon: "facebook" },
  { label: "Instagram", href: "https://www.instagram.com/ampliteach", icon: "instagram" },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UC5oQkM8mug78vQeov9qT1NQ",
    icon: "youtube",
  },
];
