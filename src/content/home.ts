import { EXTERNAL } from "@/lib/constants/routes";

export const HERO = {
  heading: "AmpliTeach is the ultimate all-in-one Music School Management Software",
  body: "Everything your school needs in one platform — lesson scheduling, student and parent communication, automated alerts, payments, invoicing, payroll and enrolment management.",
  cta: { label: "Start Your Free Trial Today", href: EXTERNAL.signup },
  image: {
    src: "/images/hero-platform.webp",
    alt: "The AmpliTeach scheduling dashboard on a laptop",
    width: 1200,
    height: 800,
  },
} as const;

export const OVERVIEW = {
  heading: "One platform, every part of your school",
  paragraphs: [
    "Schedule lessons with drag-and-drop simplicity, keep students and parents in the loop with automated text and email alerts, and collect tuition on time with secure autopay and invoicing.",
    "Payroll, enrolment and reporting are built in — so the admin work that used to eat your evenings takes minutes instead.",
  ],
} as const;

export const STUDENT_BENEFITS = {
  heading: "Student Benefits",
  items: [
    "Full access to an award-winning curriculum of lessons, videos, audio tracks and worksheets.",
    "A personal dashboard showing lesson history, assignments and practice goals.",
    "Direct chat with their teacher between lessons.",
    "Automatic practice reminders that keep momentum going all week.",
  ],
  image: {
    src: "/images/student-guitar.webp",
    alt: "A student practising guitar at home",
    width: 800,
    height: 900,
  },
} as const;

export const TRIAL_CTA = {
  heading: "Discover the Power of AmpliTeach!",
  body: "Tell us a little about your school and we will set you up with a free trial.",
  privacyNote:
    "We respect your privacy. Your details are used only to set up your trial and are never sold.",
} as const;

export const TRANSFORM_CTA = {
  heading: "Transform Your Music School with AmpliTeach",
  body: "Join the schools spending less time on admin and more time teaching. Start your 30-day free trial — no contract, cancel any time.",
  cta: { label: "Start Your Free Trial", href: EXTERNAL.signup },
} as const;
