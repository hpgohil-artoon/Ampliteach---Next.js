import { SITE } from "./site";

export const CONTACT_PAGE = {
  heading: "Get In Touch",
  body: "Questions about plans, migrating your data, or whether AmpliTeach fits your school? Send us a note and we will get back to you.",
  details: [
    { label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
    { label: "Phone", value: SITE.phone, href: SITE.phoneHref },
    {
      label: "Address",
      value: `${SITE.address.street}, ${SITE.address.city} ${SITE.address.state} ${SITE.address.postalCode}`,
      href: `https://www.google.com/maps/search/?api=1&query=${SITE.geo.latitude},${SITE.geo.longitude}`,
    },
  ],
  map: {
    title: "AmpliTeach office location",
    src: `https://maps.google.com/maps?q=${SITE.geo.latitude},${SITE.geo.longitude}&z=15&output=embed`,
  },
} as const;
