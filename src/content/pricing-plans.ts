import type { PricingPlan } from "@/types";
import { EXTERNAL } from "@/lib/constants/routes";

/**
 * Prices as they appear on the live site today.
 *
 * Under static export these are also the FALLBACK if the CMS is unreachable at
 * build time — see src/lib/api/pricing.ts. Never let a build produce a pricing
 * page with no prices on it.
 */
export const SHARED_FEATURES = [
  "Drag-and-drop lesson scheduling",
  "Automatic payments and invoicing",
  "Email and text alerts",
  "Reporting and enrolment tracking",
  "Full curriculum access",
  "Teacher training and certification",
  "Group email tools",
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free-trial",
    name: "30 Day Free Trial",
    audience: "trial",
    priceMonthly: 0,
    priceLabel: "$0",
    studentLimit: 50,
    studentLimitLabel: "Up to 50 students",
    description: "Try the whole platform for 30 days. No contract, no card required.",
    features: SHARED_FEATURES,
    cta: { label: "Get Started", href: EXTERNAL.signup },
  },
  {
    id: "low-volume-teacher",
    name: "Low Volume — Teacher",
    audience: "teacher",
    priceMonthly: 49,
    priceLabel: "$49",
    studentLimit: 50,
    studentLimitLabel: "Up to 50 students",
    description: "For independent teachers building a studio.",
    features: SHARED_FEATURES,
    cta: { label: "Get Started", href: EXTERNAL.signup },
  },
  {
    id: "amplified-teacher",
    name: "Amplified — Teacher",
    audience: "teacher",
    priceMonthly: 79,
    priceLabel: "$79",
    studentLimit: 100,
    studentLimitLabel: "Up to 100 students",
    description: "For established private teachers with a full roster.",
    features: SHARED_FEATURES,
    cta: { label: "Get Started", href: EXTERNAL.signup },
  },
  {
    id: "low-volume-school",
    name: "Low Volume — School",
    audience: "school",
    priceMonthly: 99,
    priceLabel: "$99",
    studentLimit: 100,
    studentLimitLabel: "Up to 100 students",
    description: "For small schools with a handful of teachers.",
    features: SHARED_FEATURES,
    cta: { label: "Get Started", href: EXTERNAL.signup },
  },
  {
    id: "making-noise-school",
    name: "Making Noise — School",
    audience: "school",
    priceMonthly: 189,
    priceLabel: "$189",
    studentLimit: 200,
    studentLimitLabel: "Up to 200 students",
    description: "For growing schools running multiple teachers and rooms.",
    features: SHARED_FEATURES,
    cta: { label: "Get Started", href: EXTERNAL.signup },
  },
  {
    id: "amplified-school",
    name: "Amplified — School",
    audience: "school",
    priceMonthly: 269,
    priceLabel: "$269",
    studentLimit: 300,
    studentLimitLabel: "Up to 300 students",
    description: "Our most popular school plan.",
    features: SHARED_FEATURES,
    cta: { label: "Get Started", href: EXTERNAL.signup },
    featured: true,
  },
  {
    id: "cranked-up-school",
    name: "Cranked Up — School",
    audience: "school",
    priceMonthly: 399,
    priceLabel: "$399",
    studentLimit: 500,
    studentLimitLabel: "Up to 500 students",
    description: "For large schools operating at scale.",
    features: SHARED_FEATURES,
    cta: { label: "Get Started", href: EXTERNAL.signup },
  },
];

export const PRICING_PAGE = {
  heading: "Simple, Month-to-Month Pricing",
  subheading: "No contracts. Change or cancel your plan at any time.",
  enterprise: {
    heading: "Multiple Locations or over 500 Students",
    body: "Running a multi-location operation or more than 500 students? We will build a plan around it.",
    priceLabel: "Priced Upon Request",
    cta: { label: "Contact Us", href: "/contact-us" },
  },
} as const;
