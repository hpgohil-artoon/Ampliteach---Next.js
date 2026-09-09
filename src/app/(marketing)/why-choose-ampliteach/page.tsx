import { buildMetadata } from "@/lib/seo";
import { TRANSFORM_CTA } from "@/content/home";
import { CtaBanner } from "@/components/common";
import {
  CurriculumAndSupport,
  FounderMessage,
  PitchBlocks,
  ProfitClaim,
  TakeTeacherHome,
  WhyChooseHero,
} from "@/features/why-choose/sections";

export const metadata = buildMetadata({
  title: "Why Choose AmpliTeach",
  description:
    "The only music school platform with an award-winning curriculum included — plus painless onboarding, exceptional support, more profit and more free time.",
  path: "/why-choose-ampliteach",
});

export default function WhyChooseUsPage() {
  return (
    <>
      <WhyChooseHero />
      <ProfitClaim />
      <CurriculumAndSupport />
      <FounderMessage />
      <TakeTeacherHome />
      <PitchBlocks />
      <CtaBanner {...TRANSFORM_CTA} />
    </>
  );
}
