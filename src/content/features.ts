import {
  Award,
  BookOpen,
  CalendarRange,
  CreditCard,
  GraduationCap,
  Mail,
  MessageSquare,
  Rocket,
  Settings2,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import type { Feature } from "@/types";

/** Homepage — "Features That Drive Success". */
export const HOME_FEATURES: Feature[] = [
  {
    title: "Effortless Drag-and-Drop Scheduling",
    description:
      "Build and rearrange your entire lesson calendar by dragging. Conflicts and room clashes are caught before they happen.",
    icon: CalendarRange,
  },
  {
    title: "Automated Text and Email Alerts",
    description:
      "Lesson reminders, cancellations and payment notices go out on their own, so nobody misses a thing.",
    icon: MessageSquare,
  },
  {
    title: "Secure Autopay and Invoicing",
    description:
      "Collect tuition automatically with stored payment methods, and send invoices that reconcile themselves.",
    icon: CreditCard,
  },
  {
    title: "Simplified Payroll",
    description:
      "Teacher hours flow straight from the schedule into payroll — no spreadsheets, no double entry.",
    icon: Wallet,
  },
  {
    title: "Engaged School Community",
    description:
      "Chat, announcements and shared practice goals keep teachers, students and parents connected all week.",
    icon: Sparkles,
  },
  {
    title: "Grow with Build My Biz",
    description:
      "Marketing playbooks, ad templates and sales training built specifically for growing a music school.",
    icon: TrendingUp,
  },
  {
    title: "Customizable Platform",
    description:
      "Match your branding, set your own lesson types, terms and policies, and configure what each role can see.",
    icon: Settings2,
  },
  {
    title: "Intuitive Email Tools",
    description:
      "Send targeted group email to any segment of your school — one studio, one teacher's roster, or everyone.",
    icon: Mail,
  },
  {
    title: "Teacher Training and Certification",
    description:
      "Onboard new teachers with structured training, and certify them on your curriculum as they progress.",
    icon: GraduationCap,
  },
  {
    title: "Free Music Curriculum",
    description:
      "Thousands of lessons, videos, audio tracks and worksheets included at no extra cost.",
    icon: BookOpen,
  },
  {
    title: "Revenue Opportunities",
    description:
      "Add group classes, recitals and programs like Little Rockers to open new income streams.",
    icon: Award,
  },
  {
    title: "Easy Onboarding",
    description:
      "Our team migrates your existing student database for you. Most schools are running within days.",
    icon: Rocket,
  },
];

/** Features & Benefits page — "Features include:". */
export const PAGE_FEATURES: Feature[] = [
  {
    title: "Lesson Scheduling",
    description: "Drag-and-drop scheduling for private lessons, group classes and make-ups.",
    icon: CalendarRange,
  },
  {
    title: "Payroll",
    description: "Teacher pay calculated from the schedule, ready to approve and export.",
    icon: Wallet,
  },
  {
    title: "Teacher Certification",
    description: "Train and certify your teachers on the AmpliTeach curriculum.",
    icon: GraduationCap,
  },
  {
    title: "Income Opportunities",
    description: "Programs and add-ons designed to increase revenue per student.",
    icon: TrendingUp,
  },
  {
    title: "Lesson Library",
    description: "Thousands of on-demand lessons across instruments and levels.",
    icon: BookOpen,
  },
  {
    title: "Payments",
    description: "Autopay, invoicing, and reporting on every dollar owed and collected.",
    icon: CreditCard,
  },
  {
    title: "Business Tools",
    description: "Enrolment tracking, retention reporting and admin workflows.",
    icon: Settings2,
  },
  {
    title: "Practice Platform",
    description: "Assignments, practice logging and reminders that students actually use.",
    icon: Sparkles,
  },
  {
    title: "Curriculum",
    description: "An award-winning curriculum included with every plan.",
    icon: Award,
  },
];

export const TEACHER_BENEFITS = [
  "A full teaching day planned in minutes, not hours.",
  "Every lesson note, assignment and payment in one student record.",
  "Automatic reminders that cut no-shows.",
  "Curriculum and worksheets ready to assign — no lesson prep from scratch.",
  "Training and certification to grow your own skills.",
];

export const STUDENT_PAGE_BENEFITS = [
  "On-demand lessons, videos and audio to practise with at home.",
  "A dashboard showing exactly what to work on this week.",
  "Chat with their teacher between lessons.",
  "Practice reminders and progress they can see.",
];

export const BUILD_MY_BIZ = {
  heading: "Build My Biz",
  intro:
    "Every plan includes Build My Biz — the marketing, training and business material we used to grow our own schools.",
  items: [
    "Marketing campaigns ready to run",
    "Teacher and staff training",
    "Advertising templates and creative",
    "Business administration workflows",
    "Curriculum and lesson planning",
    "Forms, contracts and policies",
    "Growth and retention strategies",
    "Sales training for enrolment calls",
    "Certificates and student awards",
  ],
} as const;
