import { OVERVIEW } from "@/content/home";
import { Container, Section, SectionHeading } from "@/components/common";

export function Overview() {
  return (
    <Section tone="muted">
      <Container size="narrow" className="flex flex-col gap-6">
        <SectionHeading title={OVERVIEW.heading} />
        {OVERVIEW.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-muted-foreground text-center text-lg leading-relaxed">
            {paragraph}
          </p>
        ))}
      </Container>
    </Section>
  );
}
