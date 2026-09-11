import { PricingPage } from "@/features/pricing";
import { buildMetadata } from "@/lib/seo";
import { getPricingPlans } from "@/lib/api/pricing";

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
export default async function Page() {
  const plans = await getPricingPlans();

  return <PricingPage plans={plans} />;
}
