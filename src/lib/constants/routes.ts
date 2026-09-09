/**
 * Every internal URL in one place. Never hard-code a path in a component —
 * if a route moves, this file is the only edit.
 *
 * Blog posts sit at the domain ROOT (/best-music-school-scheduling-software/),
 * mirroring the existing WordPress URLs so no SEO is lost.
 */
export const ROUTES = {
  home: "/",
  whyChooseUs: "/why-choose-ampliteach",
  featuresAndBenefits: "/features-and-benefits",
  littleRockers: "/little-rockers-program",
  pricing: "/pricing",
  blog: "/blog",
  blogPage: (page: number) => (page <= 1 ? "/blog" : `/blog/page/${page}`),
  post: (slug: string) => `/${slug}`,
  contact: "/contact-us",
  privacyPolicy: "/privacy-policy",
  termsOfService: "/terms-of-service",
} as const;

export const EXTERNAL = {
  login: "https://app.ampliteach.com/login",
  signup: "https://app.ampliteach.com/register",
} as const;

/** Posts per page on the blog index — matches the current WordPress site. */
export const POSTS_PER_PAGE = 6;
