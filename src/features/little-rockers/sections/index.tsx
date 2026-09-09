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

export function ProgramDescription() {
  return (
    <Section tone="muted">
      <Container size="narrow" className="flex flex-col gap-6">
        <SectionHeading title={LITTLE_ROCKERS.description.heading} align="left" />
        {LITTLE_ROCKERS.description.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-muted-foreground text-lg leading-relaxed">
            {paragraph}
          </p>
        ))}
      </Container>
    </Section>
  );
}
