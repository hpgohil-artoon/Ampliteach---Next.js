import type { HomePageContent } from "@/types";
import { ROUTES } from "@/lib/constants/routes";
import { HOME_FAQS } from "./faqs";
import { HOME_FEATURES } from "./features";
import { TESTIMONIALS, TESTIMONIALS_HEADING } from "./testimonials";

/**
 * The trial section's anchor id. The live hero CTA links to
 * `#power_of_ampliteach`, so the id has to match the live site exactly — it is
 * a real URL that may be linked from outside.
 */
export const TRIAL_CTA_ID = "power_of_ampliteach";

/**
 * The home page, in the exact shape the CMS will serve.
 *
 * This is the committed fallback: it renders today with no CMS at all, and
 * once `CMS_API_URL` is set `getHomeContent()` prefers the CMS payload and
 * falls back to this if the fetch or its validation fails. A build must never
 * ship an empty page, so this file stays current rather than becoming a stub.
 *
 * `blocks` is ordered and every entry carries a stable `id` — those ids are
 * what the CMS reorders and what React keys on, so do not renumber them.
 */
export const HOME_PAGE: HomePageContent = {
  path: "/",
  seo: {
    title: "All-in-One Music School Management Software",
    absoluteTitle: "AmpliTeach — All-in-One Music School Management Software",
    description:
      "AmpliTeach brings lesson scheduling, parent communication, payments, invoicing and payroll into one platform — with an award-winning curriculum included.",
  },
  blocks: [
    {
      id: "home-hero",
      type: "hero",
      // The typed-text widget. NOT a heading on the live site — the page's only
      // `h1` is the feature grid's title, which is why that block sets
      // `headingLevel: "h1"` below.
      eyebrow: "WHY AMPLITEACH?",
      // Split on the `<b>` boundaries in the live source, so the field stays
      // plain text and no section has to render HTML for a bold phrase.
      body: [
        { text: "AmpliTeach is the ultimate all-in-one " },
        { text: "Music School Management Software", bold: true },
        {
          text: " built by music school owners, for music school owners. We personally onboard and train your team for a seamless, stress-free setup. Empower your school to thrive. Get started today!",
        },
      ],
      // The live label reads "START YOUR FREE TRIAL TODAy" — a typo in WordPress
      // that its `text-transform: uppercase` hides. Cased properly here; the
      // uppercase comes from the button, so it renders identically.
      //
      // The href is the in-page anchor, not the signup URL: the live hero links
      // to `#power_of_ampliteach`, which is the trial block's `anchorId`.
      cta: { label: "Start Your Free Trial Today", href: `#${TRIAL_CTA_ID}` },
      video: {
        youtubeId: "IPRyrJA5obM",
        title: "AmpliTeach Explainer video",
        poster: {
          src: "/images/hero-video-overlay.webp",
          alt: "",
          width: 489,
          height: 275,
        },
      },
    },
    {
      id: "home-overview",
      type: "overview",
      // No heading: the live section is a screenshot beside a paragraph, and
      // the page's only `h1` is the feature grid's.
      body: [
        { text: "AmpliTeach is a powerful music school and " },
        { text: "studio management software", bold: true },
        { text: " built to simplify and scale modern music education businesses. As a top-rated " },
        { text: "music school CRM", bold: true },
        {
          text: ", AmpliTeach brings together lesson scheduling, student and parent communication, automated text and email alerts, online payments, invoicing, and payroll into one easy-to-use platform. Designed by experienced music school owners for private instructors and multi-teacher studios, our all-in-one ",
        },
        { text: "music school management software", bold: true },
        {
          text: " reduces administrative workload while helping schools increase enrollment, improve student retention, and manage daily operations more efficiently across the US.",
        },
      ],
      image: {
        src: "/images/overview-dashboard.webp",
        // The live alt is "image-2-1-scaled" — the upload's filename, which
        // tells a screen reader nothing. Described properly instead; alt text
        // carries no visual weight, so parity is unaffected.
        alt: "The AmpliTeach dashboard open on a laptop",
        width: 595,
        height: 397,
      },
      mediaSide: "left",
    },
    {
      id: "home-features",
      type: "feature-grid",
      anchorId: "features",
      // Uppercase in the copy, not by `text-transform` — the live CSS applies
      // none, so the casing has to live here to render the same.
      heading: "FEATURES THAT DRIVE SUCCESS",
      // The page's only `h1`, as on the live site. No eyebrow and no standfirst:
      // the live section is the heading and the grid, nothing else.
      headingLevel: "h1",
      features: HOME_FEATURES,
      cta: { label: "Start Your Free Trial Today", href: `#${TRIAL_CTA_ID}` },
      // Twelve features in rows of two, with the button repeating after every
      // second row — three buttons on the live page.
      ctaAfterEvery: 4,
    },
    {
      id: "home-student-benefits",
      type: "benefit-media",
      // The live `h2` carries this id, so external links may point at it.
      anchorId: "student-benefits",
      // Uppercase in the copy, not by `text-transform`.
      heading: "STUDENT BENEFITS",
      items: [
        "The only platform that includes an award-winning music school curriculum with lesson support, videos, audio tracks and worksheets.",
        "Student dashboard with access to lesson assignments, schedule, and interactive learning tools.",
        "Our safe and secure open form chat feature allows students to communicate with their teacher.",
        "Daily text practice reminders help students stay on track and progress.",
      ],
      image: {
        src: "/images/student-benefits-guitar.webp",
        // The live alt is "gitar", the upload's filename. Described properly.
        alt: "A young student playing an electric guitar",
        width: 293,
        height: 293,
      },
      mediaSide: "right",
    },
    {
      id: "home-trial",
      type: "trial-cta",
      anchorId: TRIAL_CTA_ID,
      // Uppercase in the copy, not by `text-transform`. No eyebrow on the live
      // section — the heading stands alone above the form.
      heading: "DISCOVER THE POWER OF AMPLITEACH!",
      // Three groups, matching the live text widgets: the last holds two
      // paragraphs, which is why they sit 18px apart rather than 12px.
      body: [
        [[{ text: "Fill out the form to start your FREE 30-day trial of AmpliTeach today." }]],
        [
          [
            {
              text: "Access an exclusive demo and experience seamless music school management, start your journey to transformation!",
            },
          ],
        ],
        [
          [{ text: "Want to learn more?" }],
          [
            { text: "Schedule a free, no-obligation consultation at " },
            { text: "203-934-2501", bold: true },
            {
              text: " to see how the AmpliTeach school management system can transform your business. You will be amazed at what AmpliTeach can do for your school, now’s the time!",
            },
          ],
        ],
      ],
      privacyNote:
        "Your privacy matters to us. We’ll never share your information with third parties.",
    },
    {
      id: "home-testimonials",
      type: "testimonials",
      // The live `h2` carries this id.
      anchorId: "what-are-the-teachers-saying",
      heading: TESTIMONIALS_HEADING,
      items: TESTIMONIALS,
      // The live href really is "#" — the button goes nowhere yet. Kept as-is
      // rather than invented; it is a content fix for the client, not a build
      // decision, and PARITY records it as an open question.
      cta: { label: "Click here to see more testimonials", href: "#" },
    },
    {
      id: "home-faqs",
      type: "faqs",
      anchorId: "faqs",
      // No eyebrow on the live section — the heading stands alone.
      heading: "FAQs",
      items: HOME_FAQS,
      image: {
        src: "/images/faqs-teacher.webp",
        // The live alt is "FAQS", the upload's filename. Described properly.
        alt: "A music teacher at a desk with the AmpliTeach schedule on screen",
        width: 443,
        height: 443,
      },
      mediaSide: "right",
      closingHeading: "Got more questions?",
      cta: { label: "Contact Our Support Team", href: ROUTES.contact },
    },
    {
      // Was a `cta-banner` with invented copy and a button. The live page
      // closes with two text-only bands and no button at all, so the block
      // type changed with it. `cta-banner` and `TRANSFORM_CTA` stay in the
      // codebase — they still close why-choose, features-and-benefits,
      // little-rockers and pricing, which have not been rebuilt from live
      // markup yet. The id changed too, since it is a different block.
      id: "home-closing",
      type: "closing-statement",
      intro:
        "AmpliTeach is dedicated to empowering music schools across the USA with cutting-edge music school management software. Spend less time on administration and more time nurturing your students’ love for music.",
      // Uppercase in the copy, not by `text-transform` — the live CSS applies
      // none, so the casing has to live here to render the same.
      statement: [
        [
          { text: "TRANSFORM YOUR MUSIC SCHOOL WITH AMPLITEACH.", breakAfter: true },
          { text: "START MANAGING LESSONS, PAYMENTS, AND SCHEDULES", breakAfter: true },
          { text: "ALL IN ONE PLACE." },
        ],
        [{ text: "GET STARTED TODAY!" }],
      ],
    },
  ],
};
