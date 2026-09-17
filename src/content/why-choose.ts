import type { WhyChoosePageContent } from "@/types";
import { ROUTES } from "@/lib/constants/routes";

/**
 * The why-choose page's copy — every word taken verbatim from
 * ampliteach.com/why-choose-ampliteach/, in the shape the CMS will serve.
 *
 * This is the PERMANENT fallback, not scaffolding: `lib/api/why-choose.ts`
 * prefers the CMS and falls back here whenever the CMS is unset, unreachable or
 * publishes a payload that fails validation.
 *
 * Emphasis is structural. The live markup bolds phrases with `<strong>`, links
 * one word, and italicises three quoted lines through a theme class — all of
 * which are `TextRun` flags here, because a content field may never contain
 * markup (see `.claude/CLAUDE.md`).
 *
 * The block ORDER is the live page's order, and it lives in this array rather
 * than in JSX so an editor can reorder or hide sections.
 */

/** The red music note the live page bullets its pitch rows and cards with. */
const NOTE_BULLET = {
  src: "/svg/note-bullet.svg",
  alt: "",
  width: 19,
  height: 34,
} as const;

export const WHY_CHOOSE_PAGE: WhyChoosePageContent = {
  path: ROUTES.whyChooseUs,

  // Verbatim from the live page's <title> and meta description.
  seo: {
    title: "Why Choose Ampliteach",
    absoluteTitle: "Why Choose Ampliteach | Music School Management Software",
    description:
      "Choose Ampliteach studio management software for music schools with scheduling, curriculum tools, lesson apps, and CRM for music teachers & school management.",
  },

  blocks: [
    {
      id: "banner",
      type: "page-banner",
      heading: "Why Choose Ampliteach",
      breadcrumbs: [{ label: "Home", href: ROUTES.home }, { label: "Why Choose Ampliteach" }],
    },

    {
      id: "intro",
      type: "media-intro",
      heading: "Why should you choose AmpliTeach?",
      mediaSide: "left",
      image: {
        src: "/images/why-choose-illustration.svg",
        alt: "An illustrated guitarist singing into a microphone",
        width: 872,
        height: 754,
      },
      body: [
        {
          text: "Created by music school owners and designed to help you run your school seamlessly with ease! For private teachers or a multi-teacher school, ",
        },
        // Linked AND bold on the live site; the brand red follows from the link.
        { text: "AmpliTeach", href: ROUTES.home, bold: true },
        {
          text: " is all in one place, everything you need to communicate with students and parents, to house and build a studio curriculum, and to schedule and accept payments. No need for multiple systems to run your business, we thought of everything you’ll need and it’s all here in one place. ",
        },
        {
          text: "Music Inc. Magazine says AmpliTeach is groundbreaking and innovative!",
          bold: true,
        },
        {
          text: " Email & Texts Alerts, Drag and Drop Scheduling, Payroll, Reports, Group Emails, Curriculum, Teacher Training and much more all included!",
        },
      ],
    },

    {
      id: "pitch",
      type: "pitch-rows",
      bullet: NOTE_BULLET,
      rows: [
        {
          body: [{ text: "AmpliTeach = More Profits and More Free Time!", bold: true }],
        },
        {
          body: [
            {
              text: "The Only School/Studio Platform with the Curriculum Included ",
              bold: true,
            },
            {
              text: "The big BONUS is you also get a complete award-winning curriculum with thousands of lessons including videos, audio tracks and work sheets for all your teachers to use as much or little as they wish to enhance their lesson plan. Students, for the first time ever have a support system to guide them to practice effectively at home the other six days they are without their teacher.",
            },
          ],
        },
        {
          body: [
            {
              text: "Our Onboarding Process is Quick & Painless, Our Support is Exceptional",
              bold: true,
              // The live row forces its own break rather than wrapping.
              breakAfter: true,
            },
            {
              text: "Our award-winning support team is the best in the business and will have you up and running quickly! We can take your existing database and set everything up in AmpliTeach. We guarantee an amazing customer service experience.",
            },
          ],
        },
      ],
    },

    {
      id: "founder",
      type: "founder-message",
      heading: "A Message from the Creator of AmpliTeach",
      name: "John McCarthy",
      role: "Creator of Ampliteach",
      portrait: {
        src: "/images/john-mccarthy.png",
        alt: "John McCarthy, creator of AmpliTeach",
        width: 224,
        height: 224,
      },
      quote: [
        {
          text: "Hi I’m John McCarthy, I’ve taught more people to play music than any other teacher in the world! Over 4 million of my books, DVDs and programs have helped musicians get started in music or achieve their musical goals.  I opened my first music school at 15 when I was a sophomore in high school and teaching music has been my passion ever since. I want to share my secrets that have revolutionized how schools and teachers can excel to new heights. I’ve created a complete system and a blueprint for school owners and teachers called AmpliTeach that guides you through a proven path of success’. With AmpliTeach you will grow your business, make more profits and do less work. It’s a complete solution for the whole studio: instructors, administrative staff, students, and families. Everything you need all in one place, easy to use and I guarantee your success.",
        },
      ],
      // Order matters: the section places them clef, star, note.
      decorations: [
        { src: "/svg/particle-clef.svg", alt: "", width: 35, height: 58 },
        { src: "/svg/particle-star.svg", alt: "", width: 30, height: 29 },
        { src: "/svg/note-bullet.svg", alt: "", width: 19, height: 34 },
      ],
    },

    {
      id: "take-teacher-home",
      type: "centered-intro",
      heading: "Take Your Teacher Home",
      subheading: "Extra Support at Home 7 Days a Week:",
      body: [
        {
          text: "How great would it be if students could have a teacher with them every day not just once a week? We created a system where students can get practice support 7 days a week! On AmpliTeach, with one click teachers send videos, audio tracks, worksheets and more that support each lesson directly to students. This guides them through practice at home and increases student success ten-fold!",
        },
      ],
    },

    {
      id: "cards",
      type: "tinted-cards",
      cards: [
        {
          title: "The Onboarding Process is Quick & Easy",
          tone: "lilac",
          icon: NOTE_BULLET,
          body: [
            {
              text: "Our award-winning support team is the best in the business and will have you up and running quickly! We can take your existing database and set everything up in AmpliTeach. We guarantee an amazing customer service experience",
            },
          ],
        },
        {
          title: "Special Piano Teacher Bonus!",
          tone: "mint",
          icon: NOTE_BULLET,
          body: [
            {
              text: "Rock House & AmpliTeach founder John McCarthy has a special surprise for piano teachers. “Years ago, I realized there was a problem, students learning from traditional piano methods would have to take lessons for almost two years before they would be able to play popular songs they love. This is especially a problem these days, people want things quickly with an online mentality. I created a new piano learning system called “KeyTab” that has students playing chord progressions and popular songs within months. This is why we always had three times the piano students than any other area school.” The Patented “KeyTab” learning system is part of our complete curriculum that you will have to use with your students! Hundreds of song lessons with videos, backing tracks and sheet music.",
            },
          ],
        },
        {
          title: "Desperate Music Teacher Alert!",
          tone: "cream",
          icon: NOTE_BULLET,
          body: [
            {
              text: "We talk to music teachers every day; most have extensive teaching experience but the things that virtually every teacher tell us are:",
              breakAfter: true,
            },
            {
              text: "“I am struggling to keep my students excited to learn”",
              italic: true,
              breakAfter: true,
            },
            {
              text: "“I lose more students than I should.”",
              italic: true,
              breakAfter: true,
            },
            {
              text: "“Students struggle practicing at home.” ",
              italic: true,
              breakAfter: true,
            },
            {
              text: "‘AmpliTeach’ has solved all these problems and more! We don’t tell you how to teach, it’s important for every teacher to have their own personality. We provide all the tools and guidance to make a teacher’s job easier and provide proven methods to grow your business.",
            },
          ],
        },
      ],
    },
  ],
};
