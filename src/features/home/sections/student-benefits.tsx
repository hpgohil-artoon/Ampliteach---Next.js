import { STUDENT_BENEFITS } from "@/content/home";
import { BenefitList, Container, Section, SectionHeading } from "@/components/common";

export function StudentBenefits() {
  return (
    <Section tone="muted">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        {/* TODO: replace with <Img {...STUDENT_BENEFITS.image} /> once the asset is in place. */}
        <div className="bg-background aspect-square w-full rounded-xl" aria-hidden />

        <div className="flex flex-col gap-6">
          <SectionHeading title={STUDENT_BENEFITS.heading} align="left" />
          <BenefitList items={STUDENT_BENEFITS.items} />
        </div>
      </Container>
    </Section>
  );
}
