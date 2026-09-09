export type PlanAudience = "trial" | "teacher" | "school" | "enterprise";

export type PricingPlan = {
  id: string;
  name: string;
  audience: PlanAudience;
  /** null = "Priced Upon Request". */
  priceMonthly: number | null;
  priceLabel: string;
  studentLimit: number | null;
  studentLimitLabel: string;
  description: string;
  features: string[];
  cta: {
    label: string;
    href: string;
  };
  featured?: boolean;
};
