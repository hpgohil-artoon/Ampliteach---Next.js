import type { PricingPlan } from "@/types";
import { Container, Section } from "@/components/common";
import { PricingCard } from "../components";

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
              <h2 className="font-heading text-h3">{group.title}</h2>
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
