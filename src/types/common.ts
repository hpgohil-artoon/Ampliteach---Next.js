import type { LucideIcon } from "lucide-react";

export type NavLink = {
  label: string;
  href: string;
  /** External links open in a new tab and get rel="noopener". */
  external?: boolean;
};

export type SocialLink = {
  label: string;
  href: string;
  icon: "twitter" | "facebook" | "instagram" | "youtube";
};

export type Feature = {
  title: string;
  description: string;
  icon?: LucideIcon;
};

export type Faq = {
  question: string;
  answer: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  location?: string;
  role?: string;
};

export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Breadcrumb = {
  label: string;
  href?: string;
};
