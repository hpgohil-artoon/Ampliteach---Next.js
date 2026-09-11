import { TRANSFORM_CTA } from "@/content/shared";
import { CtaBanner } from "@/components/common";
import { BuildMyBiz, FeaturesGrid, PageTitle, TeacherStudentBenefits } from "./sections";

/** The Features & Benefits outline. One name per file in `./sections`. */
export function FeaturesBenefitsPage() {
  return (
    <>
      <PageTitle />
      <FeaturesGrid />
      <TeacherStudentBenefits />
      <BuildMyBiz />
      <CtaBanner {...TRANSFORM_CTA} />
    </>
  );
}
