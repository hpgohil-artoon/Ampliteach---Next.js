import { WHY_CHOOSE } from "@/content/why-choose";
import { Container, ParticleDecor, Section, SectionHeading } from "@/components/common";
import { Card, CardContent } from "@/components/ui/card";

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

export function ProfitClaim() {
  return (
    <Section tone="muted" spacing="tight">
      <Container size="narrow" className="text-center">
        <h2 className="font-heading text-2xl font-bold text-balance sm:text-3xl">
          {WHY_CHOOSE.profitClaim.heading}
        </h2>
        <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
          {WHY_CHOOSE.profitClaim.body}
        </p>
      </Container>
    </Section>
  );
}

export function CurriculumAndSupport() {
  return (
    <Section>
      <Container className="grid gap-8 md:grid-cols-2">
        {WHY_CHOOSE.blocks.map((block) => (
          <Card key={block.heading} className="h-full">
            <CardContent className="flex flex-col gap-3">
              <h2 className="font-heading text-xl font-semibold text-balance">{block.heading}</h2>
              <p className="text-muted-foreground leading-relaxed">{block.body}</p>
            </CardContent>
          </Card>
        ))}
      </Container>
    </Section>
  );
}

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

export function TakeTeacherHome() {
  const { takeTeacherHome } = WHY_CHOOSE;

  return (
    <Section className="overflow-hidden">
      <ParticleDecor />
      <Container size="narrow" className="relative">
        <SectionHeading
          eyebrow={takeTeacherHome.subheading}
          title={takeTeacherHome.heading}
          description={takeTeacherHome.body}
        />
      </Container>
    </Section>
  );
}

export function PitchBlocks() {
  return (
    <Section tone="muted">
      <Container className="grid gap-8 lg:grid-cols-3">
        {WHY_CHOOSE.pitchBlocks.map((block) => (
          <Card key={block.heading} className="h-full">
            <CardContent className="flex flex-col gap-3">
              <h2 className="font-heading text-lg font-semibold text-balance">{block.heading}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{block.body}</p>
            </CardContent>
          </Card>
        ))}
      </Container>
    </Section>
  );
}
