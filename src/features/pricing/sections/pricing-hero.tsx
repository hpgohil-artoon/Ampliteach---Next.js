import { PRICING_PAGE } from "@/content/pricing-plans";
import { Container, Section, SectionHeading } from "@/components/common";

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
