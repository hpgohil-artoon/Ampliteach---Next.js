import type { Faq } from "@/types";

/**
 * The three home-page FAQs, verbatim from the live section.
 *
 * The `Q:` and `A:` prefixes are part of the live copy — they sit inside the
 * heading and the paragraph, not in the section's markup — so they stay in the
 * strings rather than being added at render time.
 */
export const HOME_FAQS: Faq[] = [
  {
    question: "Q: How quickly can I start using AmpliTeach?",
    answer:
      "A: Getting started with AmpliTeach is fast and easy. Most schools are fully set up and using our music school CRM within days.",
  },
  {
    question: "Q: Does AmpliTeach offer any training or support?",
    answer:
      "A: Yes! We offer comprehensive training and support to ensure you get the most out of the AmpliTeach music school management software.",
  },
  {
    question: "Q: How does AmpliTeach protect my data and privacy?",
    answer:
      "A: AmpliTeach uses industry-standard encryption to ensure that your data is always safe and secure.",
  },
];
