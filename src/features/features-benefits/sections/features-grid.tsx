import { PAGE_FEATURES } from "@/content/features";
import { Container, FeatureCard, Section, SectionHeading } from "@/components/common";

export function FeaturesGrid() {
  return (
    <Section>
      <Container className="flex flex-col gap-12">
        <SectionHeading title="Features include:" />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PAGE_FEATURES.map((feature) => (
            <li key={feature.title}>
              <FeatureCard {...feature} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
