import type { Feature } from "@/types";

/**
 * Homepage — "Features That Drive Success".
 *
 * Twelve icon-boxes, transcribed run-for-run from the live markup: each
 * `<strong>` becomes a bold run and the one `<br>` becomes `breakAfter`. The
 * live source pads some `<strong>` tags with spaces (`<strong> foo </strong>`)
 * and doubles a few others; HTML collapses both, so the runs here carry single
 * spaces and render identically.
 */
export const HOME_FEATURES: Feature[] = [
  {
    icon: "calendar-alt",
    title: "Effortless Drag-and-Drop Scheduling",
    description: [
      { text: "Simplify scheduling with a flexible " },
      { text: "music school management platform", bold: true },
      { text: " built for schools of any size.", breakAfter: true },
      {
        text: "Use our intuitive drag-and-drop interface to manage lessons, assign teachers, and optimize room usage.",
      },
    ],
    bullets: [
      [{ text: "Effortlessly assign rooms and instructors." }],
      [{ text: "Flexible teacher and room schedule views." }],
      [{ text: "Lesson banking for missed or rescheduled classes." }],
    ],
  },
  {
    icon: "comments",
    title: "Automated Text and Email Alerts",
    description: [
      { text: "Keep everyone in sync", bold: true },
      { text: " with automatic " },
      { text: "text and email alerts.", bold: true },
      { text: " Ensure students, parents, and teachers never miss a beat." },
    ],
    bullets: [
      [{ text: "Automated", bold: true }, { text: " reminders for lessons and schedules." }],
      [
        { text: "Real-time " },
        { text: "notifications", bold: true },
        { text: " for rescheduling or cancellations." },
      ],
      [{ text: "Billing alerts", bold: true }, { text: " to keep payments on track." }],
    ],
  },
  {
    icon: "file-invoice",
    title: "Secure Autopay and Invoicing",
    description: [
      { text: "Automate payments and invoicing", bold: true },
      { text: " with reliable, secure billing. Collect tuition seamlessly with our " },
      { text: "autopay feature.", bold: true },
    ],
    bullets: [
      [
        { text: "Customizable payment plans", bold: true },
        { text: " to fit your school’s needs." },
      ],
      [{ text: "Fast and accurate" }, { text: " payment tracking and reports.", bold: true }],
      [
        { text: "Easy" },
        { text: " invoicing", bold: true },
        { text: " for lessons and products." },
      ],
    ],
  },
  {
    icon: "file-powerpoint",
    title: "Simplified Payroll",
    description: [
      { text: "Streamline payroll management", bold: true },
      {
        text: " for your staff. With quick setup and automated reports, focus on growth instead of admin.",
      },
    ],
    bullets: [
      [
        { text: "Easy " },
        { text: "payroll setup", bold: true },
        { text: " and detailed reporting." },
      ],
      [{ text: "Tax season reports", bold: true }, { text: " for hassle-free accounting." }],
    ],
  },
  {
    icon: "school",
    title: "Engaged School Community",
    description: [
      { text: "Connect students, teachers, and parents", bold: true },
      { text: " through" },
      { text: " interactive dashboards.", bold: true },
      { text: " Keep everyone informed and engaged." },
    ],
    bullets: [
      [
        { text: "Student dashboards", bold: true },
        { text: " for schedules, assignments, and quizzes." },
      ],
      [{ text: "Teacher tools", bold: true }, { text: " to track progress and update parents." }],
      [
        { text: "Interactive learning tools", bold: true },
        { text: " to boost student engagement." },
      ],
    ],
  },
  {
    icon: "chart-line",
    title: "Grow with Build My Biz",
    description: [
      { text: "Expand your school", bold: true },
      { text: " with resources tailored for success. The toolkit supports " },
      { text: "business", bold: true },
      { text: " growth and " },
      { text: "teacher development.", bold: true },
    ],
    bullets: [
      [{ text: "Access to " }, { text: "sales and business training.", bold: true }],
      [{ text: "Comprehensive " }, { text: "teacher training materials.", bold: true }],
      [{ text: "Essential " }, { text: "forms, documents, and worksheets.", bold: true }],
    ],
  },
  {
    icon: "edit",
    title: "Customizable Platform",
    description: [
      { text: "Adapt AmpliTeach", bold: true },
      {
        text: " to fit your school’s unique needs. Set permissions and tailor features to suit your school’s structure.",
      },
    ],
    bullets: [
      [{ text: "Fully customizable " }, { text: "music school CRM", bold: true }],
      [{ text: "Multi-location and room support." }],
      [{ text: "Role-based access controls." }],
    ],
  },
  {
    icon: "envelope",
    title: "Intuitive Email Tools",
    description: [
      { text: "Manage communications", bold: true },
      { text: " from your dashboard. Send emails to" },
      { text: " targeted groups", bold: true },
      { text: " of students, parents, and staff effortlessly." },
    ],
    bullets: [
      [
        { text: "Reach " },
        { text: "specific groups,", bold: true },
        { text: " like instrument-based or active students." },
      ],
      [{ text: "Attachment support", bold: true }, { text: " for announcements and updates." }],
    ],
  },
  {
    icon: "certificate",
    title: "Teacher Training and Certification",
    description: [
      { text: "High-quality training", bold: true },
      {
        text: " ensures teaching excellence. Teachers learn valuable information that helps keep students motivated and increases retention!",
      },
    ],
    bullets: [
      [
        { text: "Optional " },
        { text: "Teacher Certification", bold: true },
        { text: " for instructors." },
      ],
    ],
  },
  {
    icon: "bezier-curve",
    title: "Free Music Curriculum",
    description: [
      { text: "Gain access to Rock House Method’s " },
      { text: "award-winning curriculum", bold: true },
      { text: " for various instruments." },
    ],
    bullets: [
      [
        { text: "Over 5,000 multimedia lessons", bold: true },
        { text: " for structured learning." },
      ],
      [{ text: "Teachers assign lessons in just a few clicks." }],
    ],
  },
  {
    icon: "chart-bar",
    title: "Revenue Opportunities",
    description: [{ text: "Sell instruments and accessories directly to students at a profit." }],
    bullets: [
      [{ text: "Direct-to-student sales", bold: true }, { text: " for increased income." }],
    ],
  },
  {
    icon: "handshake",
    title: "Easy Onboarding",
    description: [
      { text: "Our team supports a " },
      { text: "smooth setup,", bold: true },
      { text: " so you’re up and running quickly." },
    ],
    bullets: [[{ text: "Comprehensive onboarding guidance.", bold: true }]],
  },
];

/**
 * Features & Benefits page. Placeholder copy and lucide icons — this page has
 * not been rebuilt against the live site yet, so treat none of it as measured.
 */
export const PAGE_FEATURES: Feature[] = [
  {
    title: "Lesson Scheduling",
    description: [
      { text: "Drag-and-drop scheduling for private lessons, group classes and make-ups." },
    ],
    icon: "calendar-range",
  },
  {
    title: "Payroll",
    description: [
      { text: "Teacher pay calculated from the schedule, ready to approve and export." },
    ],
    icon: "wallet",
  },
  {
    title: "Teacher Certification",
    description: [{ text: "Train and certify your teachers on the AmpliTeach curriculum." }],
    icon: "graduation-cap",
  },
  {
    title: "Income Opportunities",
    description: [{ text: "Programs and add-ons designed to increase revenue per student." }],
    icon: "trending-up",
  },
  {
    title: "Lesson Library",
    description: [{ text: "Thousands of on-demand lessons across instruments and levels." }],
    icon: "book-open",
  },
  {
    title: "Payments",
    description: [
      { text: "Autopay, invoicing, and reporting on every dollar owed and collected." },
    ],
    icon: "credit-card",
  },
  {
    title: "Business Tools",
    description: [{ text: "Enrolment tracking, retention reporting and admin workflows." }],
    icon: "settings",
  },
  {
    title: "Practice Platform",
    description: [
      { text: "Assignments, practice logging and reminders that students actually use." },
    ],
    icon: "sparkles",
  },
  {
    title: "Curriculum",
    description: [{ text: "An award-winning curriculum included with every plan." }],
    icon: "award",
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
