import { LITTLE_ROCKERS } from "@/content/little-rockers";
import { Container, Section, SectionHeading } from "@/components/common";

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
