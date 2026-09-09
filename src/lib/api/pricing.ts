import type { PricingPlan } from "@/types";
import { env } from "@/config/env";
import { PRICING_PLANS } from "@/content/pricing-plans";
import { apiGet } from "./client";

const TAG = "pricing";

/**
 * Pricing plans.
 *
 * Falls back to the committed plans in src/content/pricing-plans.ts if the CMS
 * is unreachable or not yet configured. A build must never ship a pricing page
 * with no prices on it, so this deliberately swallows the error and logs it.
 */
export async function getPricingPlans(): Promise<PricingPlan[]> {
  if (!env.CMS_API_URL) return PRICING_PLANS;

  try {
    const plans = await apiGet<PricingPlan[]>(`${env.CMS_API_URL}/pricing-plans`, {
      tags: [TAG],
    });
    return plans.length ? plans : PRICING_PLANS;
  } catch (error) {
    console.warn("[pricing] CMS fetch failed, using committed fallback plans.", error);
    return PRICING_PLANS;
  }
}
