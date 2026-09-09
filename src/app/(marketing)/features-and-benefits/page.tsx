import { buildMetadata } from "@/lib/seo";
import { TRANSFORM_CTA } from "@/content/home";
import { CtaBanner } from "@/components/common";
import {
  BuildMyBiz,
  FeaturesGrid,
  PageTitle,
  TeacherStudentBenefits,
} from "@/features/features-benefits/sections";

export const metadata = buildMetadata({
  title: "Features & Benefits",
  description:
    "Scheduling, payroll, payments, curriculum, teacher certification and Build My Biz — every AmpliTeach feature and what it means for your teachers and students.",
  path: "/features-and-benefits",
});

export default function FeaturesAndBenefitsPage() {
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
