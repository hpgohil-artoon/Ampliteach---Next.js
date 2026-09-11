import { TRANSFORM_CTA } from "@/content/shared";
import { CtaBanner } from "@/components/common";
import {
  CurriculumAndSupport,
  FounderMessage,
  PitchBlocks,
  ProfitClaim,
  TakeTeacherHome,
  WhyChooseHero,
} from "./sections";

/** The Why Choose Us outline. One name per file in `./sections`. */
export function WhyChoosePage() {
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
