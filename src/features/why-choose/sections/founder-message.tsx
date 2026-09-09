import { WHY_CHOOSE } from "@/content/why-choose";
import { Container, Section, SectionHeading } from "@/components/common";

export function FounderMessage() {
  const { founder } = WHY_CHOOSE;

  return (
    <Section tone="muted">
      <Container className="grid items-center gap-10 md:grid-cols-[240px_1fr]">
        {/* TODO: replace with <Img {...founder.image} /> once the portrait is added. */}
        <div
          className="bg-background mx-auto aspect-square w-48 rounded-full md:w-full"
          aria-hidden
        />

        <div className="flex flex-col gap-4">
          <SectionHeading title={founder.heading} align="left" />
          <blockquote className="text-lg leading-relaxed">{founder.body}</blockquote>
          <footer className="text-sm">
            <p className="font-semibold">{founder.name}</p>
            <p className="text-muted-foreground">{founder.role}</p>
          </footer>
        </div>
      </Container>
    </Section>
  );
}
