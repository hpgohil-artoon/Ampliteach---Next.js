import { FeaturesBenefitsPage } from "@/features/features-benefits";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Features & Benefits",
  description:
    "Scheduling, payroll, payments, curriculum, teacher certification and Build My Biz — every AmpliTeach feature and what it means for your teachers and students.",
  path: "/features-and-benefits",
});

export default function Page() {
  return <FeaturesBenefitsPage />;
}
