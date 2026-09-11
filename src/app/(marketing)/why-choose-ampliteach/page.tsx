import { WhyChoosePage } from "@/features/why-choose";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Why Choose AmpliTeach",
  description:
    "The only music school platform with an award-winning curriculum included — plus painless onboarding, exceptional support, more profit and more free time.",
  path: "/why-choose-ampliteach",
});

export default function Page() {
  return <WhyChoosePage />;
}
