import { WHY_CHOOSE } from "@/content/why-choose";
import { Container, ParticleDecor, Section, SectionHeading } from "@/components/common";

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
