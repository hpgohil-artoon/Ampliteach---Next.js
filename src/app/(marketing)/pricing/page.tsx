import { buildMetadata } from "@/lib/seo";
import { getPricingPlans } from "@/lib/api/pricing";
import { TRANSFORM_CTA } from "@/content/home";
import { CtaBanner } from "@/components/common";
import { EnterprisePricing, PlanGrid, PricingHero } from "@/features/pricing/sections";

export const metadata = buildMetadata({
  title: "Pricing",
  description:
    "Month-to-month pricing with no contracts. Teacher plans from $49/month and school plans from $99/month, with a 30-day free trial.",
  path: "/pricing",
});

/**
 * Plans are fetched from the CMS at BUILD time (static export cannot
 * revalidate). Set NEXT_BUILD_MODE=server and add `export const revalidate`
 * below to turn this into an ISR page instead.
 */
export default async function PricingPage() {
  const plans = await getPricingPlans();

  return (
    <>
      <PricingHero />
      <PlanGrid plans={plans} />
      <EnterprisePricing />
      <CtaBanner {...TRANSFORM_CTA} />
    </>
  );
}
