import type { Testimonial } from "@/types";

/** Uppercase in the copy: the live heading applies no `text-transform`. */
export const TESTIMONIALS_HEADING = "WHAT ARE THE TEACHERS SAYING?";

/**
 * One testimonial, as on the live page.
 *
 * The quote's line breaks are `breakAfter`, not wrapping: the live markup has
 * two explicit `<br>`s, so the three lines hold whatever the viewport does.
 * Note the trailing space before the first break — it is in the live source and
 * kept so the run list round-trips the copy exactly.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    quote: [
      { text: "“I love AmpliTeach because it makes " },
      { text: "music lesson management", bold: true },
      { text: " so easy. ", breakAfter: true },
      { text: "Scheduling, assigning practice, and communicating with parents are " },
      { text: "effortless", bold: true },
      { text: ".", breakAfter: true },
      { text: "The platform is " },
      { text: "user-friendly", bold: true },
      { text: " and " },
      { text: "intuitive.", bold: true },
      { text: "”" },
    ],
    author: "Dylan R.",
    location: "Connecticut",
  },
];
