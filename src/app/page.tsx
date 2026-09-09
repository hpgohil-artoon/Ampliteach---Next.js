import { buildMetadata } from "@/lib/seo";
import {
  Faqs,
  Features,
  Hero,
  Overview,
  StudentBenefits,
  Testimonials,
  TransformCta,
  TrialCta,
} from "@/features/home/sections";

export const metadata = {
  ...buildMetadata({
    title: "All-in-One Music School Management Software",
    description:
      "AmpliTeach brings lesson scheduling, parent communication, payments, invoicing and payroll into one platform — with an award-winning curriculum included.",
    path: "/",
  }),
  title: { absolute: "AmpliTeach — All-in-One Music School Management Software" },
};

/**
 * A page file only composes. Sections live in src/features/home/sections and
 * their copy lives in src/content — which is why this file stays this short.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Overview />
      <Features />
      <StudentBenefits />
      <TrialCta />
      <Testimonials />
      <Faqs />
      <TransformCta />
    </>
  );
}
