import { HOME_FEATURES } from "@/content/features";
import { Container, FeatureCard, Section, SectionHeading } from "@/components/common";

export function Features() {
  return (
    <Section id="features">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Features"
          title="Features That Drive Success"
          description="Everything a music school needs to run — in one platform, with nothing bolted on."
        />

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {HOME_FEATURES.map((feature) => (
            <li key={feature.title}>
              <FeatureCard {...feature} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
