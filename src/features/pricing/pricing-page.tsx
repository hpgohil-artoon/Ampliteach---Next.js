import type { PricingPlan } from "@/types";
import { TRANSFORM_CTA } from "@/content/shared";
import { CtaBanner } from "@/components/common";
import { EnterprisePricing, PlanGrid, PricingHero } from "./sections";

/**
 * The Pricing outline. `plans` is resolved by the route, which is also where
 * the build-time-vs-ISR decision lives — this component just renders them.
 */
export function PricingPage({ plans }: { plans: PricingPlan[] }) {
  return (
    <>
      <PricingHero />
      <PlanGrid plans={plans} />
      <EnterprisePricing />
      <CtaBanner {...TRANSFORM_CTA} />
    </>
  );
}
