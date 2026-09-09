import { WHY_CHOOSE } from "@/content/why-choose";
import { Container, ParticleDecor, Section, SectionHeading } from "@/components/common";

export function WhyChooseHero() {
  return (
    <Section spacing="loose" className="overflow-hidden">
      <ParticleDecor />
      <Container size="narrow" className="relative">
        <SectionHeading
          as="h1"
          title={WHY_CHOOSE.hero.heading}
          description={WHY_CHOOSE.hero.body}
        />
      </Container>
    </Section>
  );
}
