import Link from "next/link";
import type { PricingPlan } from "@/types";
import { PRICING_PAGE } from "@/content/pricing-plans";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container, Section, SectionHeading } from "@/components/common";
import { PricingCard } from "../components/pricing-card";

export function PricingHero() {
  return (
    <Section spacing="tight">
      <Container size="narrow">
        <SectionHeading
          as="h1"
          eyebrow="Pricing"
          title={PRICING_PAGE.heading}
          description={PRICING_PAGE.subheading}
        />
      </Container>
    </Section>
  );
}

/** Plans come from getPricingPlans() in the page — this section just renders. */
export function PlanGrid({ plans }: { plans: PricingPlan[] }) {
  const trial = plans.filter((plan) => plan.audience === "trial");
  const teacher = plans.filter((plan) => plan.audience === "teacher");
  const school = plans.filter((plan) => plan.audience === "school");

  return (
    <Section spacing="tight">
      <Container size="wide" className="flex flex-col gap-16">
        {[
          { title: "Free Trial", plans: trial },
          { title: "For Teachers", plans: teacher },
          { title: "For Schools", plans: school },
        ]
          .filter((group) => group.plans.length > 0)
          .map((group) => (
            <div key={group.title} className="flex flex-col gap-8">
              <h2 className="font-heading text-2xl font-bold tracking-tight">{group.title}</h2>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {group.plans.map((plan) => (
                  <li key={plan.id}>
                    <PricingCard plan={plan} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </Container>
    </Section>
  );
}

export function EnterprisePricing() {
  const { enterprise } = PRICING_PAGE;

  return (
    <Section tone="muted">
      <Container size="narrow">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 text-center">
            <h2 className="font-heading text-2xl font-bold text-balance">{enterprise.heading}</h2>
            <p className="text-muted-foreground leading-relaxed">{enterprise.body}</p>
            <p className="font-heading text-xl font-semibold">{enterprise.priceLabel}</p>
            <Button asChild size="lg">
              <Link href={enterprise.cta.href}>{enterprise.cta.label}</Link>
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Section>
  );
}
