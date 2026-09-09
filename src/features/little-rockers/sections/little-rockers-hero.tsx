import { LITTLE_ROCKERS } from "@/content/little-rockers";
import { Container, ParticleDecor, Section, SectionHeading } from "@/components/common";

export function LittleRockersHero() {
  return (
    <Section spacing="loose" className="overflow-hidden">
      <ParticleDecor />
      <Container size="narrow" className="relative">
        <SectionHeading
          as="h1"
          title={LITTLE_ROCKERS.hero.heading}
          description={LITTLE_ROCKERS.hero.body}
        />
      </Container>
    </Section>
  );
}
