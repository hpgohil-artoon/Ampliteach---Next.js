import type { CtaBannerBlock } from "@/types";
import { EXTERNAL } from "@/lib/constants/routes";

/**
 * Copy that appears on more than one page.
 *
 * The trial banner closes six pages. It lives here so the pages not yet
 * converted to the block model keep sharing one copy of it, and so the CMS
 * seeds every page's banner from the same starting text.
 */
export const TRANSFORM_CTA: Omit<CtaBannerBlock, "id" | "type"> = {
  heading: "Transform Your Music School with AmpliTeach",
  body: "Join the schools spending less time on admin and more time teaching. Start your 30-day free trial — no contract, cancel any time.",
  cta: { label: "Start Your Free Trial", href: EXTERNAL.signup },
};
