import {
  BUILD_MY_BIZ,
  PAGE_FEATURES,
  STUDENT_PAGE_BENEFITS,
  TEACHER_BENEFITS,
} from "@/content/features";
import { ROUTES } from "@/lib/constants/routes";
import { Breadcrumbs } from "@/components/layout";
import {
  BenefitList,
  Container,
  FeatureCard,
  ParticleDecor,
  Section,
  SectionHeading,
} from "@/components/common";

export function PageTitle() {
  return (
    <Section spacing="tight" tone="muted">
      <Container className="flex flex-col gap-4">
        <Breadcrumbs
          items={[{ label: "Home", href: ROUTES.home }, { label: "Features & Benefits" }]}
        />
        <h1 className="font-heading text-h1">Features &amp; Benefits</h1>
      </Container>
    </Section>
  );
}

export function FeaturesGrid() {
  return (
    <Section>
      <Container className="flex flex-col gap-12">
        <SectionHeading title="Features include:" />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PAGE_FEATURES.map((feature) => (
            <li key={feature.title}>
              <FeatureCard {...feature} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

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

export function BuildMyBiz() {
  return (
    <Section className="overflow-hidden">
      <ParticleDecor />
      <Container className="relative flex flex-col gap-10">
        <SectionHeading title={BUILD_MY_BIZ.heading} description={BUILD_MY_BIZ.intro} />
        <ul className="mx-auto grid w-full max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BUILD_MY_BIZ.items.map((item) => (
            <li key={item} className="border-border bg-card rounded-lg border px-4 py-3 text-sm">
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
