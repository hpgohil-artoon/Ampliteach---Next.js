import { STUDENT_PAGE_BENEFITS, TEACHER_BENEFITS } from "@/content/features";
import { BenefitList, Container, Section, SectionHeading } from "@/components/common";

export function TeacherStudentBenefits() {
  return (
    <Section tone="muted">
      <Container className="flex flex-col gap-12">
        <SectionHeading title="AmpliTeach Benefits for Teachers and Students" />

        <div className="grid gap-12 md:grid-cols-2">
          <div className="flex flex-col gap-5">
            <h3 className="font-heading text-h4">For Teachers</h3>
            <BenefitList items={TEACHER_BENEFITS} />
          </div>
          <div className="flex flex-col gap-5">
            <h3 className="font-heading text-h4">For Students</h3>
            <BenefitList items={STUDENT_PAGE_BENEFITS} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
